from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, DateTime, ARRAY, func
from sqlalchemy.orm import relationship
from .database import Base

class Institution(Base):
    __tablename__ = "institutions"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    short = Column(String)
    city = Column(String)
    state = Column(String)
    domain = Column(String, unique=True, index=True)

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    handle = Column(String, unique=True, index=True)
    display_name = Column(String)
    initials = Column(String)
    role = Column(String)
    institution_id = Column(String, ForeignKey("institutions.id"))
    level = Column(Integer, default=1)
    xp = Column(Integer, default=0)
    streak_days = Column(Integer, default=0)
    credits = Column(Integer, default=0)
    skills = Column(ARRAY(String), default=[])
    interests = Column(ARRAY(String), default=[])
    bio = Column(String, nullable=True)

    institution = relationship("Institution")

class Community(Base):
    __tablename__ = "communities"
    id = Column(String, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    name = Column(String)
    description = Column(String)
    syllabus_tag = Column(String, nullable=True)
    member_count = Column(Integer, default=0)
    post_count = Column(Integer, default=0)
    category = Column(String)

class Post(Base):
    __tablename__ = "posts"
    id = Column(String, primary_key=True, index=True)
    community_slug = Column(String, ForeignKey("communities.slug"))
    author_id = Column(String, ForeignKey("users.id"))
    anon = Column(Boolean, default=False)
    title = Column(String)
    body = Column(String)
    status = Column(String, default="open")
    upvotes = Column(Integer, default=0)
    comment_count = Column(Integer, default=0)
    credits = Column(Integer, default=0)
    tags = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CreditEvent(Base):
    __tablename__ = "credit_events"
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    type = Column(String)
    source_id = Column(String)
    confirmer_id = Column(String, nullable=True)
    weight = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
