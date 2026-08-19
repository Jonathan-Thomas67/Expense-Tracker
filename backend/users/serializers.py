from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "name", "email", "mobile", "password"]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def create(self, validated_data):
        # username must be unique for AbstractUser; derive it from the email.
        base_username = validated_data["email"].split("@")[0]
        username = base_username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        user = User(
            username=username,
            name=validated_data["name"],
            email=validated_data["email"],
            mobile=validated_data.get("mobile", ""),
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["email"], password=attrs["password"])
        # ModelBackend authenticates against USERNAME_FIELD (email) already,
        # but be explicit in case a custom backend isn't configured.
        if user is None:
            try:
                candidate = User.objects.get(email__iexact=attrs["email"])
            except User.DoesNotExist:
                candidate = None
            if candidate and candidate.check_password(attrs["password"]):
                user = candidate
        if user is None or not user.is_active:
            raise serializers.ValidationError("Invalid email or password.")
        attrs["user"] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "mobile", "role", "created_at"]
        read_only_fields = ["id", "email", "role", "created_at"]
