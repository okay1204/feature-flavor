import logging
from types import TracebackType
from typing import Type

import asyncpg
from asyncpg import Connection, Pool
from decouple import config

logger = logging.getLogger('feature_flavor')

async def connection_init(conn: Connection):
    await conn.execute("SET CLIENT_ENCODING to 'utf-8';")

class DbConnection:
    pool: Pool = None

    @classmethod
    async def initialize(cls):
        try:
            cls.pool = await asyncpg.create_pool(
                host = config('DATABASE_HOST'),
                database = config('DATABASE_NAME'),
                user = config('DATABASE_USERNAME'),
                password = config('DATABASE_PASSWORD'),
                port = config('DATABASE_PORT'),
                init = connection_init
            )
        except Exception as e:
            logger.error(f'Failed to initialize database pool: {e}')
            raise e
        else:
            logger.info('Database pool initialized')
    
    @classmethod
    async def cleanup(cls):
        """Clean up the database pool"""
        if cls.pool:
            cls.pool.terminate()
            cls.pool = None
            logger.info('Database pool terminated')

class ConnectionIfExists:
    """
    A utility class that allows for a connection to be passed in.  If it is not passed in, it will acquire a connection from the pool.
    """
    __slots__ = ('connection', 'existing_connection')

    def __init__(self, connection: Connection | None):
        self.connection = connection
        self.existing_connection = connection is not None
    
    async def __aenter__(self) -> Connection | None:
        if not self.existing_connection:
            self.connection = await DbConnection.pool.acquire()
    
        return self.connection

    async def __aexit__(self, exc_type: Type[Exception] | None, exc_instance: Exception | None, traceback: TracebackType | None):
        if not self.existing_connection:
            await DbConnection.pool.release(self.connection)