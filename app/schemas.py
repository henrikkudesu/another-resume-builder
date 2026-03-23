from typing import List, Literal, Optional, Union

from pydantic import BaseModel, model_validator


class Experience(BaseModel):
    role: str
    company: str
    description: Union[str, List[str]]
    style: Literal["bullet", "paragraph"] = "bullet"

    @model_validator(mode="after")
    def normalize_description_by_style(self):
        if self.style == "paragraph":
            if isinstance(self.description, list):
                self.description = " ".join(str(item).strip() for item in self.description if str(item).strip())
            else:
                self.description = " ".join(str(self.description).replace("\n", " ").split())
            return self

        if isinstance(self.description, str):
            bullets = [
                line.replace("-", "", 1).strip()
                for line in self.description.split("\n")
                if line.strip()
            ]
            self.description = bullets or [self.description.strip()] if self.description.strip() else []
        else:
            self.description = [str(item).strip() for item in self.description if str(item).strip()]

        return self


class Education(BaseModel):
    school: str
    course: str
    period: Optional[str] = ""
    description: Optional[str] = ""


class Extras(BaseModel):
    skills: Optional[str] = ""
    certifications: Optional[str] = ""
    interests: Optional[str] = ""


class Personal(BaseModel):
    name: str
    city: Optional[str] = ""
    country: Optional[str] = ""
    phone: Optional[str] = ""
    links: Optional[str] = ""


class ResumeRequest(BaseModel):
    personal: Personal
    experiences: List[Experience]
    education: List[Education]
    extras: Extras
    user_prompt: Optional[str] = None

class ResumeResponse(BaseModel):
    personal: Personal
    summary: str
    experiences: List[Experience]
    education: List[Education]
    extras: Extras