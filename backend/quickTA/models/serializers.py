from rest_framework.serializers import ModelSerializer
from models.models import GPTModel

class GPTModelSerializer(ModelSerializer):

    class Meta:
        model = GPTModel
        fields = [
            'model_id',
            'model_name',
            'status',
            'model',
            'prompt',
            'max_tokens',
            'temperature',
            'top_p',
            'n',
            'stream',
            'presence_penalty',
            'frequency_penalty'
        ]
