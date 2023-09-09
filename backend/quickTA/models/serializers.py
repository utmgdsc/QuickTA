from rest_framework.serializers import ModelSerializer
from models.models import GPTModel

class GPTModelSerializer(ModelSerializer):

    class Meta:
        model = GPTModel
        fields = [
            'model_id',
            'model_name',
            'course_id',
            'status',
            'model',
            'prompt',
            'suffix',
            'max_tokens',
            'temperature',
            'top_p',
            'n',
            'stream',
            'logprobs',
            'presence_penalty',
            'frequency_penalty',
            'best_of'
        ]
