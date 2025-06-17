import React from 'react'
import UserCard from '../_component/UserCard'
import InformationCard from '../_component/InformationCard'
import ProfileCard from '../_component/ProfileCard'

const page = () => {
  return (
    <div>
        <ProfileCard/>
        <UserCard/>
        <InformationCard/>
    </div>
  )
}

export default page