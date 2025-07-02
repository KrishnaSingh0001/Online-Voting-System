import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { CheckCircle, Vote as VoteIcon, Clock, AlertTriangle } from "lucide-react"
import { getCandidates, submitVote, getVotingStatus } from "@/api/voting"
import { useToast } from "@/hooks/useToast"
import { useNavigate } from "react-router-dom"

interface Candidate {
  _id: string
  name: string
  party: string
  symbol: string
  description: string
  color: string
}

interface VotingStatus {
  canVote: boolean
  hasVoted: boolean
  timeRemaining: string
  isElectionActive: boolean
}

export function Vote() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>("")
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Vote: Fetching voting data')
        const [candidatesData, statusData] = await Promise.all([
          getCandidates(),
          getVotingStatus()
        ])

        setCandidates(candidatesData.candidates)
        setVotingStatus(statusData)
        console.log('Vote: Data loaded successfully', { candidatesCount: candidatesData.candidates.length })
      } catch (error) {
        console.error('Vote: Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load voting data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleSubmitVote = async () => {
    if (!selectedCandidate) {
      toast({
        title: "No Selection",
        description: "Please select a candidate before submitting your vote",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      console.log('Vote: Submitting vote for candidate:', selectedCandidate)
      await submitVote({ candidateId: selectedCandidate })

      toast({
        title: "Vote Submitted Successfully!",
        description: "Thank you for participating in the election",
      })

      console.log('Vote: Vote submitted successfully, redirecting to home')
      navigate('/')
    } catch (error) {
      console.error('Vote: Error submitting vote:', error)
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!votingStatus?.isElectionActive) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <Clock className="h-12 w-12 text-gray-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Election Not Active</h1>
          <p className="text-lg text-muted-foreground mt-2">
            The voting period is currently closed. Please check back during the active election period.
          </p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          Return to Dashboard
        </Button>
      </div>
    )
  }

  if (votingStatus?.hasVoted) {
    return (
      <div className="text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vote Already Submitted</h1>
          <p className="text-lg text-muted-foreground mt-2">
            Thank you for participating! You have already cast your vote in this election.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            Return to Dashboard
          </Button>
          <Button onClick={() => navigate('/results')}>
            View Results
          </Button>
        </div>
      </div>
    )
  }

  const selectedCandidateData = candidates.find(c => c._id === selectedCandidate)

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Cast Your Vote
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select your preferred candidate and submit your vote securely
        </p>
        {votingStatus?.timeRemaining && (
          <Badge variant="outline" className="text-lg px-4 py-2">
            <Clock className="h-4 w-4 mr-2" />
            Time Remaining: {votingStatus.timeRemaining}
          </Badge>
        )}
      </div>

      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <VoteIcon className="h-6 w-6" />
            <span>Select Your Candidate</span>
          </CardTitle>
          <CardDescription>
            Choose one candidate from the list below. Your vote is anonymous and secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCandidate} onValueChange={setSelectedCandidate}>
            <div className="grid gap-6">
              {candidates.map((candidate) => (
                <div key={candidate._id} className="relative">
                  <Label
                    htmlFor={candidate._id}
                    className="flex items-center space-x-4 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    style={{
                      borderColor: selectedCandidate === candidate._id ? candidate.color : undefined,
                      backgroundColor: selectedCandidate === candidate._id ? `${candidate.color}10` : undefined
                    }}
                  >
                    <RadioGroupItem value={candidate._id} id={candidate._id} className="mt-1" />

                    <div className="flex-1 flex items-center space-x-6">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                        style={{ backgroundColor: candidate.color }}
                      >
                        {candidate.symbol}
                      </div>

                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          {candidate.name}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                          {candidate.party}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {candidate.description}
                        </p>
                      </div>
                    </div>

                    {selectedCandidate === candidate._id && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedCandidate && (
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Confirm Your Selection</CardTitle>
            <CardDescription className="text-blue-100">
              You have selected: <strong>{selectedCandidateData?.name}</strong> from <strong>{selectedCandidateData?.party}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="h-6 w-6 text-yellow-300" />
              <div className="flex-1">
                <p className="font-medium">Important Notice</p>
                <p className="text-sm text-blue-100">
                  Once submitted, your vote cannot be changed. Please ensure your selection is correct.
                </p>
              </div>
            </div>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full mt-6 bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3"
                  disabled={submitting}
                >
                  {submitting ? "Submitting Vote..." : "Submit My Vote"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-gray-900">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Your Vote</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to vote for <strong>{selectedCandidateData?.name}</strong> from <strong>{selectedCandidateData?.party}</strong>?
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmitVote} disabled={submitting}>
                    {submitting ? "Submitting..." : "Confirm Vote"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      )}
    </div>
  )
}