from django.test import TestCase

from .models import User

# Create your tests here.
class Test_Create_User(TestCase):

    @classmethod
    def setUpTestData(cls):
        test_user = User.objects.create(user_id='testuser1',name='Test User', utorid='testuser1', user_role='ST')

    def test_user_creation(self):
        user = User.objects.get()
        user_id = f'{user.user_id}'
        name = f'{user.name}'
        utorid = f'{user.utorid}'
        user_role = f'{user.user_role}'
        
        self.assertEqual(user_id, 'testuser1')
        self.assertEqual(name, 'Test User')
        self.assertEqual(utorid, 'testuser1')
        self.assertEqual(user_role, 'ST')