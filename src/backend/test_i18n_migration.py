#!/usr/bin/env python3
"""
Test script for i18n database migration.

This script tests:
1. Adding preferred_language column to users table
2. Creating index on users.preferred_language
3. Adding name_en column to foods table
4. Verifying rollback functionality

Usage:
    python test_i18n_migration.py
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text

# Load .env.local for local development database connection
env_local_path = os.path.join(os.path.dirname(__file__), ".env.local")
if os.path.exists(env_local_path):
    load_dotenv(env_local_path, override=True)
    print(f"[TEST] Loaded .env.local from: {env_local_path}")
else:
    print(f"[TEST] .env.local not found, using default .env")

from app.core.config import settings
from app.core.migrations import ensure_database_schema, rollback_i18n_migration


def test_migration():
    """Test the i18n migration."""
    print("\n" + "="*60)
    print("Testing i18n Database Migration")
    print("="*60 + "\n")
    
    # Create engine
    engine = create_engine(settings.database_url, pool_pre_ping=True)
    inspector = inspect(engine)
    
    print("Step 1: Running migration...")
    try:
        ensure_database_schema(engine)
        print("✓ Migration executed successfully\n")
    except Exception as e:
        print(f"✗ Migration failed: {e}\n")
        return False
    
    print("Step 2: Verifying users table changes...")
    
    # Check if preferred_language column exists
    users_columns = {col["name"] for col in inspector.get_columns("users")}
    if "preferred_language" in users_columns:
        print("✓ Column users.preferred_language exists")
    else:
        print("✗ Column users.preferred_language NOT found")
        return False
    
    # Check if index exists on preferred_language
    users_indexes = inspector.get_indexes("users")
    index_names = [idx["name"] for idx in users_indexes]
    if "idx_users_preferred_language" in index_names:
        print("✓ Index idx_users_preferred_language exists")
    else:
        print("✗ Index idx_users_preferred_language NOT found")
        return False
    
    print()
    print("Step 3: Verifying foods table changes...")
    
    # Check if name_en column exists
    foods_columns = {col["name"] for col in inspector.get_columns("foods")}
    if "name_en" in foods_columns:
        print("✓ Column foods.name_en exists")
    else:
        print("✗ Column foods.name_en NOT found")
        return False
    
    print()
    print("Step 4: Testing data operations...")
    
    # Test inserting/updating data
    try:
        with engine.begin() as conn:
            # Test updating user with preferred_language (fix MySQL subquery issue)
            conn.execute(text("""
                UPDATE users 
                SET preferred_language = 'en' 
                LIMIT 1
            """))
            print("✓ Can update users.preferred_language")
            
            # Test querying by preferred_language (uses index)
            result = conn.execute(text("""
                SELECT COUNT(*) as count 
                FROM users 
                WHERE preferred_language = 'en'
            """))
            count = result.fetchone()[0]
            print(f"✓ Can query by preferred_language (found {count} users)")
            
            # Test updating food with name_en (fix MySQL subquery issue)
            conn.execute(text("""
                UPDATE foods 
                SET name_en = 'Test Food' 
                LIMIT 1
            """))
            print("✓ Can update foods.name_en")
            
    except Exception as e:
        print(f"✗ Data operation failed: {e}")
        return False
    
    print()
    print("Step 5: Testing rollback functionality...")
    
    try:
        rollback_i18n_migration(engine)
        print("✓ Rollback executed successfully")
    except Exception as e:
        print(f"✗ Rollback failed: {e}")
        return False
    
    # Verify rollback
    inspector = inspect(engine)
    users_columns = {col["name"] for col in inspector.get_columns("users")}
    foods_columns = {col["name"] for col in inspector.get_columns("foods")}
    users_indexes = [idx["name"] for idx in inspector.get_indexes("users")]
    
    if "preferred_language" not in users_columns:
        print("✓ Column users.preferred_language removed")
    else:
        print("✗ Column users.preferred_language still exists")
        return False
    
    if "idx_users_preferred_language" not in users_indexes:
        print("✓ Index idx_users_preferred_language removed")
    else:
        print("✗ Index idx_users_preferred_language still exists")
        return False
    
    if "name_en" not in foods_columns:
        print("✓ Column foods.name_en removed")
    else:
        print("✗ Column foods.name_en still exists")
        return False
    
    print()
    print("Step 6: Re-applying migration after rollback...")
    
    try:
        ensure_database_schema(engine)
        print("✓ Migration re-applied successfully\n")
    except Exception as e:
        print(f"✗ Re-applying migration failed: {e}\n")
        return False
    
    # Verify columns exist again
    inspector = inspect(engine)
    users_columns = {col["name"] for col in inspector.get_columns("users")}
    foods_columns = {col["name"] for col in inspector.get_columns("foods")}
    users_indexes = [idx["name"] for idx in inspector.get_indexes("users")]
    
    if "preferred_language" in users_columns and "name_en" in foods_columns and "idx_users_preferred_language" in users_indexes:
        print("✓ All changes re-applied successfully")
    else:
        print("✗ Some changes were not re-applied")
        return False
    
    print()
    print("="*60)
    print("✓ ALL TESTS PASSED!")
    print("="*60)
    print()
    
    return True


if __name__ == "__main__":
    import sys
    sys.path.insert(0, "/d/DOANTOTNGHIEP/NutriGain/src/backend")
    
    success = test_migration()
    sys.exit(0 if success else 1)
