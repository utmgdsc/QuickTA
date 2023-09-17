from django.test import TestCase

from .models import User

# Create your tests here.
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User

class UserViewTestCase(TestCase):

    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'name': 'John Doe',
            'utorid': 'johndoe',
            'user_role': 'ST'
        }
        self.user = User.objects.create(**self.user_data)

    def test_get_user_by_id(self):
        url = reverse('users:get-user-details')
        response = self.client.get(url, {'user_id': self.user.user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_by_utorid(self):
        url = reverse('users:get-user-details')
        response = self.client.get(url, {'utorid': self.user.utorid})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_not_found(self):
        url = reverse('users:get-user-details')
        response = self.client.get(url, {'user_id': 'nonexistent'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_user(self):
        url = reverse('users:create-user')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_user_duplicate_utorid(self):
        url = reverse('users:create-user')
        response = self.client.post(url, self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_user_by_id(self):
        url = reverse('users:update-user')
        updated_data = {'name': 'Updated Name'}
        response = self.client.patch(url, {'user_id': self.user.user_id, **updated_data}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, updated_data['name'])

    def test_update_user_by_utorid(self):
        url = reverse('users:update-user')
        updated_data = {'name': 'Updated Name'}
        response = self.client.patch(url, {'utorid': self.user.utorid, **updated_data}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.name, updated_data['name'])

    def test_update_user_duplicate_utorid(self):
        other_user = User.objects.create(name='Another User', utorid='anotheruser', user_role='ST')
        url = reverse('users:update-user')
        response = self.client.patch(url, {'utorid': other_user.utorid, 'name': 'Updated Name'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_user_by_id(self):
        url = reverse('users:delete-user')
        response = self.client.delete(url, {'user_id': self.user.user_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user_by_utorid(self):
        url = reverse('users:delete-user')
        response = self.client.delete(url, {'utorid': self.user.utorid})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user_with_enrolled_courses(self):
        self.user.courses = ['Course1', 'Course2']
        self.user.save()
        url = reverse('users:delete-user')
        response = self.client.delete(url, {'user_id': self.user.user_id})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
