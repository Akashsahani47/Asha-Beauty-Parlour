import Sidebar from '@/components/profile/sidebar/Sidebar'
import React from 'react'

const layout = ({children}) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        {children} {/* THIS IS IMPORTANT */}
      </div>
    </div>
  )
}

export default layout
