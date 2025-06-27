import React from 'react'
import UserCard from '../_component/UserCard'

import { auth } from '@/lib/auth'
import { getEmployeesByUserId } from '@/lib/sanity/utils/employee'
import ProfileCard from './components/ProfileCard'

const page = async() => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.email ) {
    console.error("User not found in session");
    return <div>Error: User not found</div>;
  }

  const employee = await getEmployeesByUserId(user.id);

  return (
    <div>
        <ProfileCard id={user.id}/>
        <UserCard {...employee} />
    </div>
  )
}

export default page