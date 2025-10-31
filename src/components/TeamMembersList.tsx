import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  roleColor: string;
}

interface TeamMembersListProps {
  teamId: string;
}

// Mock data
const mockMembers: TeamMember[] = [
  {
    id: "1",
    name: "Nombre 1",
    role: "Rol 1",
    roleColor: "bg-primary text-primary-foreground",
  },
  {
    id: "2",
    name: "Nombre 2",
    role: "Rol 2",
    roleColor: "bg-secondary text-secondary-foreground",
  },
  {
    id: "3",
    name: "Nombre 3",
    role: "Rol 3",
    roleColor: "bg-accent text-accent-foreground",
  },
];

export default function TeamMembersList({ teamId }: TeamMembersListProps) {
  const [members] = useState(mockMembers);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-4">
      {members.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No hay miembros en este equipo</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {members.map((member) => (
            <Card key={member.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="h-12 w-12">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>

                {/* Member info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <Badge variant="secondary" className={`mt-1 ${member.roleColor}`}>
                    {member.role}
                  </Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
