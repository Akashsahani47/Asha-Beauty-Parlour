import AdminSidebar from '@/components/admin/sidebar/AdminSidebar'
import React from 'react'

const layout = ({ children }) => {
  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <AdminSidebar />
      <div className="flex-1 min-w-0 w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

export default layout