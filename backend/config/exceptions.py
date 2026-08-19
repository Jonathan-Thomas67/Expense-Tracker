"""
Turns DRF's default error responses into the simple shape used across
docs/API_SPEC.md:  {"message": "Amount must be greater than zero."}
"""

from rest_framework.views import exception_handler


def _flatten(detail):
    if isinstance(detail, dict):
        for value in detail.values():
            flat = _flatten(value)
            if flat:
                return flat
    if isinstance(detail, list):
        for value in detail:
            flat = _flatten(value)
            if flat:
                return flat
        return None
    return str(detail)


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        message = _flatten(response.data) or "Something went wrong."
        response.data = {"message": message}
    return response
