from django.http import JsonResponse

def ErrorResponse(error, status):

    def parse_error(error):
        """
        Rules to parse the error message
        """
        error_message = error.replace('\"', "'")
        return error_message

    if not isinstance(error, dict):
        return JsonResponse({"error": error}, status=status)

    errors = {"error": {}}
    for key, value in error.items():
        if isinstance(value, str):
            error_message = parse_error(value)
        elif isinstance(value, list):
            error_message = [parse_error(item) for item in value]
        else:
            error_message = value

        errors["error"][key] = error_message

    return JsonResponse(errors, status=status)

 