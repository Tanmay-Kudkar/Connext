import os
from sqlalchemy.orm import Session
from app.database import engine, Base
from app.models import Institution, User, Community, Post, CreditEvent
from app.data import INSTITUTIONS, USERS, COMMUNITIES, POSTS, CREDIT_EVENTS

def seed_database():
    print("Creating tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    with Session(engine) as db:
        print("Inserting Institutions...")
        for inst in INSTITUTIONS:
            db.add(Institution(**inst))
        
        print("Inserting Users...")
        for user in USERS:
            db.add(User(**user))
            
        print("Inserting Communities...")
        for comm in COMMUNITIES:
            db.add(Community(**comm))
            
        print("Inserting Posts...")
        for post in POSTS:
            db.add(Post(**post))
            
        print("Inserting Credit Events...")
        for event in CREDIT_EVENTS:
            db.add(CreditEvent(**event))
            
        db.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    seed_database()
