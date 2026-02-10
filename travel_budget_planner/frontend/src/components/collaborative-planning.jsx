import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, UserPlus, Share2 } from 'lucide-react'

export function CollaborativePlanning() {
    const [members, setMembers] = useState([
        { id: "1", name: "Rishav Dev", email: "rishav@example.com", contribution: 25000, color: "bg-blue-500" },
        { id: "2", name: "Diya N", email: "diya@example.com", contribution: 25000, color: "bg-purple-500" },
    ])

    const [newMember, setNewMember] = useState({ name: "", email: "" })

    const totalBudget = members.reduce((sum, member) => sum + member.contribution, 0)

    const addMember = () => {
        if (newMember.name && newMember.email) {
            const member = {
                id: Date.now().toString(),
                name: newMember.name,
                email: newMember.email,
                contribution: 0,
                color: `bg-${["red", "green", "yellow", "pink", "indigo"][Math.floor(Math.random() * 5)]}-500`,
            }
            setMembers([...members, member])
            setNewMember({ name: "", email: "" })
        }
    }

    return (
        <Card className="border-2 border-primary/30 shadow-lg animate-fade-in-up">
            <CardHeader className="bg-gradient-to-r from-primary/20 to-secondary/20">
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Collaborative Group Planning
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                {/* Total Group Budget */}
                <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-6 rounded-lg border-2 border-primary/30 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Total Group Budget</p>
                    <p className="text-4xl font-bold text-primary">₹{totalBudget.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground mt-2">{members.length} travelers</p>
                </div>

                {/* Members List */}
                <div className="space-y-3">
                    {members.map((member) => (
                        <div key={member.id} className="flex items-center gap-4 bg-muted/50 p-4 rounded-lg border border-border">
                            <Avatar className={member.color}>
                                <AvatarFallback className="text-white font-bold">
                                    {member.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-semibold">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-primary">₹{member.contribution.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Contribution</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Member Form */}
                <div className="space-y-3 pt-4 border-t border-border">
                    <p className="text-sm font-medium">Invite New Traveler</p>
                    <div className="grid md:grid-cols-3 gap-3">
                        <Input placeholder="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={newMember.email}
                            onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                        />
                        <Button onClick={addMember} className="bg-gradient-to-r from-primary to-secondary">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Invite
                        </Button>
                    </div>
                </div>

                <Button variant="outline" className="w-full gap-2">
                    <Share2 className="w-4 h-4" />
                    Share Trip Plan
                </Button>
            </CardContent>
        </Card>
    )
}
