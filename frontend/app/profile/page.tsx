import React from 'react'
import UserCard from '../_component/UserCard'
import InformationCard from '../_component/InformationCard'
import ProfileCard from '../_component/ProfileCard'
import { auth } from '@/lib/auth'
import { getEmployeesByUserId } from '@/lib/sanity/utils/employee'
import { getUserById } from '@/lib/sanity/utils/user'

const page = async() => {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.email ) {
    console.error("User not found in session");
    return <div>Error: User not found</div>;
  }

  const employee = await getEmployeesByUserId(user.id);
  const fetchedUser = await getUserById(user.id);

  return (
    <div>
        <ProfileCard id={user.id} email={user.email} name={fetchedUser.name}/>
        <UserCard {...employee} />
        <InformationCard/>
    </div>
  )
}

export default page