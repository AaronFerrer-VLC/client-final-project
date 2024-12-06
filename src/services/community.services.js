
import axios from 'axios'

class communityServices {

    constructor() {
        this.axiosApp = axios.create({
            baseURL: `${import.meta.env.VITE_APP_API_URL}/api/communities`
        })

        this.axiosApp.interceptors.request.use(config => {

            const storedToken = localStorage.getItem('authToken')

            if (storedToken) {
                config.headers = { Authorization: `Bearer ${storedToken}` }
            }

            return config

        })
    }

    fetchOneCommunity(id) {
        return this.axiosApp.get(`/${id}`)
    }

    fetchOneCommunityFullData(id) {
        return this.axiosApp.get(`details/${id}`)
    }

    fetchCommunities() {
        return this.axiosApp.get(`/`)
    }

    filterCommunities(searchQuery) {
        return this.axiosApp.get(`/search/`, searchQuery)
    }

    saveCommunity(communityData) {
        return this.axiosApp.post(`/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            communityData
        })
    }

    editCommunity(id, communityData) {
        return this.axiosApp.put(`/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            communityData
        })
    }


    deleteCommunity(id) {
        return this.axiosApp.put(`/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            communityData
        })
    }
}

export default new communityServices()