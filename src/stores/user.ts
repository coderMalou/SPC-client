import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const curUser = ref('')
const curCompany = ref('')

export const curUserData = defineStore('userData',()=>{
    const setUser = (userName: string) => {
        curUser.value = userName
    }
    const setCompany = (comName: string) => {
        curCompany.value = comName
    }

    const getUser = () => {return curUser.value}
    const getCompany = () => {return curCompany.value}

    return {setUser, setCompany, getUser, getCompany}
})