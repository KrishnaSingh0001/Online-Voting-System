import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Settings, Users, Vote, Plus, Edit, Trash2, Play, Pause, RotateCcw } from "lucide-react"
import { getAdminStats, addCandidate, updateCandidate, deleteCandidate, getVoters, toggleElection, resetElection } from "@/api/admin"
import { getCandidates } from "@/api/voting"
import { useToast } from "@/hooks/useToast"
import { useForm } from "react-hook-form"

interface AdminStats {
  totalVoters: number
  totalCandidates: number
  totalVotes: number
  electionStatus: string
  participationRate: number
}

interface Candidate {
  _id: string
  name: string
  party: string
  symbol: string
  description: string
  color: string
  votes: number
}

interface Voter {
  _id: string
  name: string
  email: string
  hasVoted: boolean
  registeredAt: string
}

interface CandidateForm {
  name: string
  party: string
  symbol: string
  description: string
  color: string
}

export function AdminDashboard() {
  const { toast } = useToast()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CandidateForm>()

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    try {
      console.log('AdminDashboard: Fetching admin data')
      const [statsData, candidatesData, votersData] = await Promise.all([
        getAdminStats(),
        getCandidates(),
        getVoters()
      ])

      setStats(statsData)
      setCandidates(candidatesData.candidates)
      setVoters(votersData.voters)
      console.log('AdminDashboard: Data loaded successfully')
    } catch (error) {
      console.error('AdminDashboard: Error fetching data:', error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCandidate = async (data: CandidateForm) => {
    try {
      console.log('AdminDashboard: Adding candidate:', data.name)
      await addCandidate(data)
      toast({
        title: "Success",
        description: "Candidate added successfully",
      })
      setIsAddDialogOpen(false)
      reset()
      fetchAllData()
    } catch (error) {
      console.error('AdminDashboard: Error adding candidate:', error)
      toast({
        title: "Error",
        description: "Failed to add candidate",
        variant: "destructive",
      })
    }
  }

  const handleEditCandidate = async (data: CandidateForm) => {
    if (!selectedCandidate) return

    try {
      console.log('AdminDashboard: Updating candidate:', selectedCandidate._id)
      await updateCandidate(selectedCandidate._id, data)
      toast({
        title: "Success",
        description: "Candidate updated successfully",
      })
      setIsEditDialogOpen(false)
      setSelectedCandidate(null)
      reset()
      fetchAllData()
    } catch (error) {
      console.error('AdminDashboard: Error updating candidate:', error)
      toast({
        title: "Error",
        description: "Failed to update candidate",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCandidate = async (candidateId: string) => {
    try {
      console.log('AdminDashboard: Deleting candidate:', candidateId)
      await deleteCandidate(candidateId)
      toast({
        title: "Success",
        description: "Candidate deleted successfully",
      })
      fetchAllData()
    } catch (error) {
      console.error('AdminDashboard: Error deleting candidate:', error)
      toast({
        title: "Error",
        description: "Failed to delete candidate",
        variant: "destructive",
      })
    }
  }

  const handleToggleElection = async () => {
    try {
      console.log('AdminDashboard: Toggling election status')
      await toggleElection()
      toast({
        title: "Success",
        description: "Election status updated successfully",
      })
      fetchAllData()
    } catch (error) {
      console.error('AdminDashboard: Error toggling election:', error)
      toast({
        title: "Error",
        description: "Failed to update election status",
        variant: "destructive",
      })
    }
  }

  const handleResetElection = async () => {
    try {
      console.log('AdminDashboard: Resetting election')
      await resetElection()
      toast({
        title: "Success",
        description: "Election reset successfully",
      })
      fetchAllData()
    } catch (error) {
      console.error('AdminDashboard: Error resetting election:', error)
      toast({
        title: "Error",
        description: "Failed to reset election",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
    setValue('name', candidate.name)
    setValue('party', candidate.party)
    setValue('symbol', candidate.symbol)
    setValue('description', candidate.description)
    setValue('color', candidate.color)
    setIsEditDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Manage elections, candidates, and monitor voting progress
        </p>
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVoters.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Candidates</CardTitle>
              <Vote className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
              <Vote className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVotes.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Participation</CardTitle>
              <Settings className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.participationRate.toFixed(1)}%</div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Settings className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <Badge variant={stats.electionStatus === 'active' ? 'default' : 'secondary'}>
                {stats.electionStatus}
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Election Controls</CardTitle>
          <CardDescription>
            Manage the election status and reset votes if needed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleToggleElection} className="flex items-center space-x-2">
              {stats?.electionStatus === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{stats?.electionStatus === 'active' ? 'Stop Election' : 'Start Election'}</span>
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center space-x-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset Election</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900">
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Election</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset all votes to zero and allow voters to vote again. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetElection}>Reset</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
          <TabsTrigger value="voters">Voters</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Manage Candidates</CardTitle>
                  <CardDescription>Add, edit, or remove candidates from the election</CardDescription>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Candidate</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-gray-900">
                    <DialogHeader>
                      <DialogTitle>Add New Candidate</DialogTitle>
                      <DialogDescription>
                        Enter the candidate's information below
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleAddCandidate)} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          {...register('name', { required: 'Name is required' })}
                          placeholder="Candidate name"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="party">Party</Label>
                        <Input
                          id="party"
                          {...register('party', { required: 'Party is required' })}
                          placeholder="Political party"
                        />
                        {errors.party && <p className="text-sm text-red-500">{errors.party.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="symbol">Symbol</Label>
                        <Input
                          id="symbol"
                          {...register('symbol', { required: 'Symbol is required' })}
                          placeholder="Party symbol (emoji or text)"
                        />
                        {errors.symbol && <p className="text-sm text-red-500">{errors.symbol.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="color">Color</Label>
                        <Input
                          id="color"
                          type="color"
                          {...register('color', { required: 'Color is required' })}
                        />
                        {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          {...register('description', { required: 'Description is required' })}
                          placeholder="Brief description of the candidate"
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Candidate</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Symbol</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Party</TableHead>
                    <TableHead>Votes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate._id}>
                      <TableCell>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: candidate.color }}
                        >
                          {candidate.symbol}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.party}</TableCell>
                      <TableCell>{candidate.votes}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(candidate)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white dark:bg-gray-900">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Candidate</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {candidate.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCandidate(candidate._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle>Edit Candidate</DialogTitle>
                <DialogDescription>
                  Update the candidate's information
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(handleEditCandidate)} className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    {...register('name', { required: 'Name is required' })}
                    placeholder="Candidate name"
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-party">Party</Label>
                  <Input
                    id="edit-party"
                    {...register('party', { required: 'Party is required' })}
                    placeholder="Political party"
                  />
                  {errors.party && <p className="text-sm text-red-500">{errors.party.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-symbol">Symbol</Label>
                  <Input
                    id="edit-symbol"
                    {...register('symbol', { required: 'Symbol is required' })}
                    placeholder="Party symbol (emoji or text)"
                  />
                  {errors.symbol && <p className="text-sm text-red-500">{errors.symbol.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-color">Color</Label>
                  <Input
                    id="edit-color"
                    type="color"
                    {...register('color', { required: 'Color is required' })}
                  />
                  {errors.color && <p className="text-sm text-red-500">{errors.color.message}</p>}
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Brief description of the candidate"
                  />
                  {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                </div>
                <DialogFooter>
                  <Button type="submit">Update Candidate</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="voters" className="space-y-6">
          <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
            <CardHeader>
              <CardTitle>Registered Voters</CardTitle>
              <CardDescription>View all registered voters and their voting status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {voters.map((voter) => (
                    <TableRow key={voter._id}>
                      <TableCell className="font-medium">{voter.name}</TableCell>
                      <TableCell>{voter.email}</TableCell>
                      <TableCell>
                        <Badge variant={voter.hasVoted ? 'default' : 'secondary'}>
                          {voter.hasVoted ? 'Voted' : 'Not Voted'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(voter.registeredAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}