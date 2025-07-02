import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, TrendingUp, Clock } from "lucide-react"
import { getElectionResults } from "@/api/voting"
import { useToast } from "@/hooks/useToast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell } from "recharts"

interface CandidateResult {
  _id: string
  name: string
  party: string
  symbol: string
  color: string
  votes: number
  percentage: number
}

interface ElectionResults {
  candidates: CandidateResult[]
  totalVotes: number
  totalVoters: number
  participationRate: number
  winner: CandidateResult | null
  isElectionActive: boolean
  lastUpdated: string
}

export function Results() {
  const { toast } = useToast()
  const [results, setResults] = useState<ElectionResults | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log('Results: Fetching election results')
        const data = await getElectionResults()
        setResults(data)
        console.log('Results: Data loaded successfully', { totalVotes: data.totalVotes })
      } catch (error) {
        console.error('Results: Error fetching results:', error)
        toast({
          title: "Error",
          description: "Failed to load election results",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchResults()

    // Auto-refresh results every 30 seconds if election is active
    const interval = setInterval(() => {
      if (results?.isElectionActive) {
        fetchResults()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [toast, results?.isElectionActive])

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

  if (!results) {
    return (
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">No Results Available</h1>
        <p className="text-lg text-muted-foreground">
          Election results are not available at this time.
        </p>
      </div>
    )
  }

  const chartData = results.candidates.map(candidate => ({
    name: candidate.name,
    votes: candidate.votes,
    fill: candidate.color
  }))

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Election Results
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {results.isElectionActive ? "Live election results - updates automatically" : "Final election results"}
        </p>
        <div className="flex justify-center items-center space-x-4">
          <Badge variant={results.isElectionActive ? "default" : "secondary"} className="text-lg px-4 py-2">
            {results.isElectionActive ? "Live Results" : "Final Results"}
          </Badge>
          <Badge variant="outline" className="text-sm px-3 py-1">
            <Clock className="h-3 w-3 mr-1" />
            Updated: {new Date(results.lastUpdated).toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Votes</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.totalVotes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Votes cast so far
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.participationRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Of eligible voters
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leading Candidate</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.winner?.name || "TBD"}</div>
            <p className="text-xs text-muted-foreground">
              {results.winner ? `${results.winner.percentage.toFixed(1)}% of votes` : "No clear leader yet"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.totalVoters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered voters
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Vote Distribution</CardTitle>
            <CardDescription>
              Percentage of votes received by each candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                votes: {
                  label: "Votes",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px] w-full"
            >
              <PieChart width="100%" height={300}>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="votes"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
          <CardHeader>
            <CardTitle>Vote Count</CardTitle>
            <CardDescription>
              Total number of votes received by each candidate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                votes: {
                  label: "Votes",
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[300px] w-full"
            >
              <BarChart width="100%" height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="votes" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
          <CardDescription>
            Complete breakdown of votes for each candidate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {results.candidates
              .sort((a, b) => b.votes - a.votes)
              .map((candidate, index) => (
                <div key={candidate._id} className="flex items-center space-x-4 p-4 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
                      {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                    </div>

                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-lg"
                      style={{ backgroundColor: candidate.color }}
                    >
                      {candidate.symbol}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {candidate.party}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {candidate.votes.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {candidate.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="w-32">
                    <Progress
                      value={candidate.percentage}
                      className="h-3"
                      style={{
                        background: `linear-gradient(to right, ${candidate.color} 0%, ${candidate.color} ${candidate.percentage}%, #e5e7eb ${candidate.percentage}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}