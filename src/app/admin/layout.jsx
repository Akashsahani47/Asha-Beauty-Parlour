import AdminSidebar from '@/components/admin/sidebar/AdminSidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
   <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        {children} {/* THIS IS IMPORTANT */}
      </div>
    </div>
  )
}

export default layout
