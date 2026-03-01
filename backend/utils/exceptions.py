"""
Custom exception classes for GraphQL operations
"""

class GraphQLUserError(Exception):
    """
    Custom exception class for user-facing GraphQL errors.
    
    These exceptions will be shown in GraphQL responses but will be filtered
    from console logs to prevent terminal flooding.
    """
    def __init__(self, message: str, code: str | None = None):
        super().__init__(message)
        self.message = message
        self.code = code or "USER_ERROR"
    
    def __str__(self):
        return self.message
    
    def __repr__(self):
        return f"GraphQLUserError(message='{self.message}', code='{self.code}')"


class GraphQLValidationError(GraphQLUserError):
    """Validation error for GraphQL operations"""
    def __init__(self, message: str):
        super().__init__(message, "VALIDATION_ERROR")


class GraphQLNotFoundError(GraphQLUserError):
    """Not found error for GraphQL operations"""
    def __init__(self, message: str):
        super().__init__(message, "NOT_FOUND")


class GraphQLConflictError(GraphQLUserError):
    """Conflict error for GraphQL operations"""
    def __init__(self, message: str):
        super().__init__(message, "CONFLICT")

class GraphQLUnauthorizedError(GraphQLUserError):
    """Unauthorized error for GraphQL operations"""
    def __init__(self, message: str):
        super().__init__(message, "UNAUTHORIZED")


class GraphQLForbiddenError(GraphQLUserError):
    """Forbidden error for GraphQL operations"""
    def __init__(self, message: str):
        super().__init__(message, "FORBIDDEN")

class SendbirdException(Exception):
    """Exception for Sendbird API errors"""
    pass