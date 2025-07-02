import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Vote, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { getElectionStatus, getVotingStats } from "@/api/voting"
import { useToast } from "@/hooks/useToast"

interface ElectionStatus {
  isActive: boolean
  startDate: string
  endDate: string
  title: string
  description: string
}

interface VotingStats {
  totalVoters: number
  votedCount: number
  remainingTime: string
  userHasVoted: boolean
}

export function Home() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [electionStatus, setElectionStatus] = useState<ElectionStatus | null>(null)
  const [votingStats, setVotingStats] = useState<VotingStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Home: Fetching election data')
        const [statusData, statsData] = await Promise.all([
          getElectionStatus(),
          getVotingStats()
        ])
        
        setElectionStatus(statusData)
        setVotingStats(statsData)
        console.log('Home: Election data loaded successfully')
      } catch (error) {
        console.error('Home: Error fetching data:', error)
        toast({
          title: "Error",
          description: "Failed to load election data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const handleVoteClick = () => {
    console.log('Home: Navigating to vote page')
    navigate('/vote')
  }

  const handleResultsClick = () => {
    console.log('Home: Navigating to results page')
    navigate('/results')
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

  const participationRate = votingStats ? (votingStats.votedCount / votingStats.totalVoters) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to VoteEase
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your secure and transparent online voting platform. Exercise your democratic right with confidence.
        </p>
      </div>

      {electionStatus && (
        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{electionStatus.title}</CardTitle>
                <CardDescription className="text-lg mt-2">
                  {electionStatus.description}
                </CardDescription>
              </div>
              <Badge 
                variant={electionStatus.isActive ? "default" : "secondary"}
                className={electionStatus.isActive ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {electionStatus.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Start: {new Date(electionStatus.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-500" />
                <span>End: {new Date(electionStatus.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Registered Voters</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingStats?.totalVoters.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              Eligible to participate in this election
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Votes Cast</CardTitle>
            <Vote className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{votingStats?.votedCount.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">
              {participationRate.toFixed(1)}% participation rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Status</CardTitle>
            {votingStats?.userHasVoted ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-orange-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {votingStats?.userHasVoted ? "Voted" : "Not Voted"}
            </div>
            <p className="text-xs text-muted-foreground">
              {votingStats?.userHasVoted ? "Thank you for participating!" : "Your vote matters"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Participation Progress</CardTitle>
          <CardDescription>
            Current voter turnout for this election
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={participationRate} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{votingStats?.votedCount || 0} voted</span>
              <span>{votingStats?.totalVoters || 0} total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Vote className="h-6 w-6" />
              <span>Cast Your Vote</span>
            </CardTitle>
            <CardDescription className="text-blue-100">
              {votingStats?.userHasVoted 
                ? "You have already voted in this election" 
                : "Participate in the democratic process"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleVoteClick}
              disabled={!electionStatus?.isActive || votingStats?.userHasVoted}
              className="w-full bg-white text-blue-600 hover:bg-gray-100"
            >
              {votingStats?.userHasVoted ? "Vote Submitted" : "Go to Voting"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-teal-600 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6" />
              <span>View Results</span>
            </CardTitle>
            <CardDescription className="text-green-100">
              See real-time election results and statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleResultsClick}
              className="w-full bg-white text-green-600 hover:bg-gray-100"
            >
              View Results
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}