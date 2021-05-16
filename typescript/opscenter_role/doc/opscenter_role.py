from diagrams import Diagram
from diagrams.aws.security import IAMRole

with Diagram("opscenter_role"):
        IAMRole("OpsCenterRole")


