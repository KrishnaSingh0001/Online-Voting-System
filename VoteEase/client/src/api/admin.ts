import api from './api';

// Description: Get admin statistics
// Endpoint: GET /api/admin/stats
// Request: {}
// Response: { totalVoters: number, totalCandidates: number, totalVotes: number, electionStatus: string, participationRate: number }
export const getAdminStats = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalVoters: 15420,
        totalCandidates: 4,
        totalVotes: 8934,
        electionStatus: 'active',
        participationRate: 57.9
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/admin/stats');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Add a new candidate
// Endpoint: POST /api/admin/candidates
// Request: { name: string, party: string, symbol: string, description: string, color: string }
// Response: { success: boolean, message: string, candidate: object }
export const addCandidate = (data: { name: string; party: string; symbol: string; description: string; color: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Candidate added successfully',
        candidate: {
          _id: Date.now().toString(),
          ...data,
          votes: 0
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/admin/candidates', data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Update an existing candidate
// Endpoint: PUT /api/admin/candidates/:id
// Request: { name: string, party: string, symbol: string, description: string, color: string }
// Response: { success: boolean, message: string, candidate: object }
export const updateCandidate = (candidateId: string, data: { name: string; party: string; symbol: string; description: string; color: string }) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Candidate updated successfully',
        candidate: {
          _id: candidateId,
          ...data
        }
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.put(`/api/admin/candidates/${candidateId}`, data);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Delete a candidate
// Endpoint: DELETE /api/admin/candidates/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteCandidate = (candidateId: string) => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Candidate deleted successfully'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.delete(`/api/admin/candidates/${candidateId}`);
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Get list of all voters
// Endpoint: GET /api/admin/voters
// Request: {}
// Response: { voters: Array<{ _id: string, name: string, email: string, hasVoted: boolean, registeredAt: string }> }
export const getVoters = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        voters: [
          {
            _id: '1',
            name: 'Alice Johnson',
            email: 'alice@example.com',
            hasVoted: true,
            registeredAt: '2024-01-15T10:30:00Z'
          },
          {
            _id: '2',
            name: 'Bob Smith',
            email: 'bob@example.com',
            hasVoted: false,
            registeredAt: '2024-01-16T14:20:00Z'
          },
          {
            _id: '3',
            name: 'Carol Davis',
            email: 'carol@example.com',
            hasVoted: true,
            registeredAt: '2024-01-17T09:15:00Z'
          },
          {
            _id: '4',
            name: 'David Wilson',
            email: 'david@example.com',
            hasVoted: false,
            registeredAt: '2024-01-18T16:45:00Z'
          },
          {
            _id: '5',
            name: 'Emma Brown',
            email: 'emma@example.com',
            hasVoted: true,
            registeredAt: '2024-01-19T11:30:00Z'
          }
        ]
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.get('/api/admin/voters');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Toggle election status (start/stop)
// Endpoint: POST /api/admin/election/toggle
// Request: {}
// Response: { success: boolean, message: string, status: string }
export const toggleElection = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Election status updated successfully',
        status: 'active'
      });
    }, 500);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/admin/election/toggle');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}

// Description: Reset election (clear all votes)
// Endpoint: POST /api/admin/election/reset
// Request: {}
// Response: { success: boolean, message: string }
export const resetElection = () => {
  // Mocking the response
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: 'Election reset successfully'
      });
    }, 1000);
  });
  // Uncomment the below lines to make an actual API call
  // try {
  //   return await api.post('/api/admin/election/reset');
  // } catch (error) {
  //   throw new Error(error?.response?.data?.error || error.message);
  // }
}