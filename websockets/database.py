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
    __tablename__ = "user_account"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    latitude: Mapped[float]
    longitude: Mapped[float]
    plan_id: Mapped[int] = mapped_column(ForeignKey("plan.id"))
    plan: Mapped["Plan"] = relationship(back_populates="places")
    #plan_id: Mapped[int] = mapped_column(ForeignKey("plan.id"))

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!r}, latitude={self.latitude!r}, longitude={self.longitude!r})"
    
class Plan(Base): # sorry can't use map keyword
    __tablename__ = "plan"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(30))
    places: Mapped[List["Place"]] = relationship(back_populates="plan")

    def __repr__(self) -> str:
        return f"Plan(id={self.id!r}, name={self.name!r}, places={self.places!r})"


def createPlace(id: int, name: str, latitude: float, longitude: float) -> Place:
    return Place(id=id, name=name, latitude=latitude, longitude=longitude)