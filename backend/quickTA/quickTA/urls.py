"""quickTA URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from students import views as student_views

from drf_yasg import openapi
from drf_yasg.views import get_schema_view as swagger_get_schema_view

schema_view = swagger_get_schema_view(
    openapi.Info(
        title="QuickTA API",
        default_version="v1",
        descrpition="API documentation of QuickTA"
    ),
    public=True,
)

urlpatterns = [
    # path('app/', include('myapp.urls')),
    path('admin/', admin.site.urls),
    path('api/',
        include([
            path('', include('students.urls', namespace='user')),
            path('swagger/schema/', schema_view.with_ui('swagger', cache_timeout=0), name="swagger-schema"),
            path('redoc', schema_view.with_ui('redoc', cache_timeout=0), name="redoc-schema")
        ])
    ),
    path('researchers/', include('researchers.urls'))
        
]
