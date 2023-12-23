from typing import List
from typing import Optional
from sqlalchemy import ForeignKey
from sqlalchemy import String
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column
from sqlalchemy.orm import relationship

class Base(DeclarativeBase):
    pass

class Place(Base):
    __tablename__ = "place"
    id: Mapped[int] = mapped_column(primary_key=True)

    uuid: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(50))
    lat: Mapped[float]
    lng: Mapped[float]
    context: Mapped[Optional[str]]

    plan_id: Mapped[int] = mapped_column(ForeignKey("plan.id"))
    plan: Mapped["Plan"] = relationship(back_populates="places")

    user_id: Mapped[str] = mapped_column(String(40))

    def __repr__(self) -> str:
        return f"Place(id={self.id!r}, name={self.name!r}, latitude={self.lat!r}, longitude={self.lng!r}, uuid={self.uuid!r}, context={self.context!r})"
    
    def toJSON(self):
        return {
            'id': self.id,
            'uuid': self.uuid,
            'name': self.name,
            'lat': self.lat,
            'lng': self.lng,
            'context': self.context
        } 
    

class Plan(Base): # sorry can't use map keyword
    __tablename__ = "plan"
    id: Mapped[int] = mapped_column(primary_key=True)
    token: Mapped[str] = mapped_column(String(40))
    name: Mapped[str] = mapped_column(String(30))
    places: Mapped[List["Place"]] = relationship(back_populates="plan")

    def __repr__(self) -> str:
        return f"Plan(id={self.id!r}, name={self.name!r}, places={self.places!r})"

def setup_database(engine):
    Base.metadata.create_all(engine)
