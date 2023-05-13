from sqlalchemy.orm import Session
from database import Place, createPlace, Plan
from sqlalchemy import delete

class Controller():
    def __init__(self, database_connection) -> None:
        self.database_connection = database_connection
        self.plan = None
        pass
    
    def load_plan(self, plan_id):
        with Session(self.database_connection) as session:
            plan = session.query(Plan).filter(Plan.id == plan_id).one()
            if plan is None:
                raise Exception("Plan not found")
            self.plan = plan
            return plan

    def create_plan(self, name=''):
        plan = Plan(name=name)
        with Session(self.database_connection) as session:
            session.add(plan)
            session.commit()
            self.plan = plan
            return plan

    def add_place(self, place):
        place_object = Place(id=place.id, name=place.name, latitude=place.latitude, longitude=place.longitude)
        with Session(self.database_connection) as session:
            session.add(place_object)
            session.commit()
        pass

    def remove_place(self, place_id):
        place_object = Place(id=place_id)
        with Session(self.database_connection) as session:
            session.delete(place_object)
            session.commit()
        pass

