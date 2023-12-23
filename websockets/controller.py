from sqlalchemy.orm import Session
from model import Place, Plan
from sqlalchemy import delete
from uuid import uuid4

class Controller():
    def __init__(self, database_connection) -> None:
        self.database_connection = database_connection
        self.plan = None
        self.session = Session(self.database_connection)
        self.user_id = str(uuid4())
        pass
    
    def close(self):
        self.session.close()

    def load_plan(self, plan_token):
        plan = self.session.query(Plan).filter(Plan.token == plan_token).one()
        if plan is None:
            raise Exception("Plan not found")
        self.plan = plan
        return plan

    def create_plan(self, name=''):
        token = str(uuid4())
        plan = Plan(name=name, token=token)
        self.session.add(plan)
        self.session.commit()
        self.plan = plan
        return plan

    def add_place(self, place):
        annotation_uuid = str(uuid4())
        place_object = Place(
            uuid=annotation_uuid, 
            name=place['name'], 
            lat=place['lat'], 
            lng=place['lng'],
            plan_id=self.plan.id,
            user_id=self.user_id
            #context=place['context']
        )
        self.session.add(place_object)
        self.session.commit()
        return place_object

    def remove_place(self, place_id):
        try:
            place_object = self.session.query(Place).filter(Place.uuid == place_id).one()
        except Exception as e:
            raise Exception("Place not found")
        self.session.delete(place_object)
        self.session.commit()
        pass

    def add_annotation(self,annotation):
        if annotation['object_type'] == 'place':
            return self.add_place(annotation)


    def remove_annotation(self,id, object_type):
        if object_type == 'place':
            return self.remove_place(id)

