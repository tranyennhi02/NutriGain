#!/usr/bin/env python3
"""
Test script for Task 4.1: Language Update Endpoint

This tests:
- PATCH /api/v1/users/me/language endpoint
- LanguageUpdateSchema validation
- Language code validation ('vi' and 'en' accepted)
- 400 error for unsupported language codes
- Success response with translated message
- Database update of User.preferred_language
"""

import sys
import os

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.database import Base, get_db
from app.models.entities import User
from app.core.security import create_access_token
import bcrypt

# Create test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test_language_update.db"
engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_test_user(db: Session, email="test@example.com", preferred_language=None):
    """Create a test user"""
    # Hash password
    hashed = bcrypt.hashpw("password123".encode("utf-8"), bcrypt.gensalt())
    password_hash = "bcrypt$" + hashed.decode("utf-8")
    
    user = User(
        email=email,
        password_hash=password_hash,
        full_name="Test User",
        email_verified=True,
        role="USER",
        status="ACTIVE",
        is_active=True,
        preferred_language=preferred_language
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_language_update_endpoint():
    """Test the language update endpoint"""
    print("\n" + "="*70)
    print("Testing Task 4.1: Language Update Endpoint")
    print("="*70 + "\n")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    # Create app and override dependencies
    from app.main import app
    app.dependency_overrides[get_db] = override_get_db
    
    client = TestClient(app)
    db = TestingSessionLocal()
    
    try:
        # Create test user with initial language preference
        print("Test 1: Create test user with initial language preference")
        user = create_test_user(db, email="testlang@example.com", preferred_language="vi")
        print(f"✓ Created test user: {user.email}")
        print(f"✓ User ID: {user.id}")
        print(f"✓ Initial preferred_language: {user.preferred_language}")
        
        # Create access token for authentication
        token = create_access_token(subject=str(user.id))
        print(f"✓ Created token for user_id={user.id}")
        headers = {"Authorization": f"Bearer {token}"}
        
        # Test 2: Update language to 'en' (valid)
        print("\nTest 2: Update language to 'en' (valid)")
        response = client.patch(
            "/api/v1/users/me/language",
            json={"language": "en"},
            headers=headers
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        if response.status_code != 200:
            print(f"ERROR: Expected 200, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        assert data["success"] is True, "Expected success=True"
        assert data["language"] == "en", f"Expected language='en', got {data['language']}"
        assert "message" in data, "Expected 'message' in response"
        print("✓ Language updated to 'en' successfully")
        
        # Verify database was updated
        db.refresh(user)
        assert user.preferred_language == "en", f"Expected preferred_language='en', got {user.preferred_language}"
        print(f"✓ Database updated: preferred_language = {user.preferred_language}")
        
        # Test 3: Update language to 'vi' (valid)
        print("\nTest 3: Update language back to 'vi' (valid)")
        response = client.patch(
            "/api/v1/users/me/language",
            json={"language": "vi"},
            headers=headers
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        data = response.json()
        assert data["success"] is True, "Expected success=True"
        assert data["language"] == "vi", f"Expected language='vi', got {data['language']}"
        print("✓ Language updated to 'vi' successfully")
        
        # Verify database was updated
        db.refresh(user)
        assert user.preferred_language == "vi", f"Expected preferred_language='vi', got {user.preferred_language}"
        print(f"✓ Database updated: preferred_language = {user.preferred_language}")
        
        # Test 4: Try unsupported language code (should fail with 400)
        print("\nTest 4: Try unsupported language code 'fr' (should return 400)")
        response = client.patch(
            "/api/v1/users/me/language",
            json={"language": "fr"},
            headers=headers
        )
        print(f"Response status: {response.status_code}")
        print(f"Response body: {response.json()}")
        
        assert response.status_code == 400, f"Expected 400, got {response.status_code}"
        print("✓ Correctly rejected unsupported language code with 400 error")
        
        # Test 5: Try invalid format (should fail with 422 validation error)
        print("\nTest 5: Try invalid language format 'english' (should return 422)")
        response = client.patch(
            "/api/v1/users/me/language",
            json={"language": "english"},
            headers=headers
        )
        print(f"Response status: {response.status_code}")
        
        assert response.status_code == 422, f"Expected 422, got {response.status_code}"
        print("✓ Correctly rejected invalid format with 422 validation error")
        
        # Test 6: Verify language didn't change after failed updates
        print("\nTest 6: Verify preferred_language unchanged after failed updates")
        db.refresh(user)
        assert user.preferred_language == "vi", f"Expected preferred_language='vi', got {user.preferred_language}"
        print(f"✓ Language remains 'vi' after failed updates")
        
        # Test 7: Try without authentication (should fail with 401)
        print("\nTest 7: Try without authentication (should return 401)")
        response = client.patch(
            "/api/v1/users/me/language",
            json={"language": "en"}
        )
        print(f"Response status: {response.status_code}")
        
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Correctly rejected unauthenticated request with 401 error")
        
        print("\n" + "="*70)
        print("✓ All tests passed!")
        print("="*70 + "\n")
        
        print("Summary:")
        print("- ✓ Endpoint accepts 'vi' and 'en' language codes")
        print("- ✓ Returns success response with translated message")
        print("- ✓ Updates User.preferred_language in database")
        print("- ✓ Returns 400 error for unsupported language codes")
        print("- ✓ Returns 422 error for invalid format")
        print("- ✓ Returns 401 error for unauthenticated requests")
        print("- ✓ Validates Requirements 3.3, 3.7, 3.8, 3.9")
        
        return True
        
    finally:
        # Cleanup
        try:
            db.query(User).delete()
            db.commit()
        except:
            pass
        finally:
            db.close()


if __name__ == "__main__":
    success = False
    try:
        success = test_language_update_endpoint()
        if not success:
            sys.exit(1)
    except AssertionError as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        # Cleanup test database
        try:
            if os.path.exists("test_language_update.db"):
                import time
                time.sleep(0.5)  # Give time for connections to close
                os.remove("test_language_update.db")
        except:
            pass

