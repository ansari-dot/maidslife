
import re

with open('e:/dbclient/admin/src/context/AdminContext.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

states_to_add = '''
  const [addons, setAddons] = useState<ServiceAddon[]>(() => loadStorage('addons', []));
  const [bookings, setBookings] = useState<BookingDetails[]>(() => loadStorage('bookings', []));
  const [cleaners, setCleaners] = useState<CleanerProfile[]>(() => loadStorage('cleaners', []));
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => loadStorage('customers', []));
  const [coupons, setCoupons] = useState<Coupon[]>(() => loadStorage('coupons', []));
  const [gallery, setGallery] = useState<GalleryScene[]>(() => loadStorage('gallery', []));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadStorage('testimonials', []));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => loadStorage('teamMembers', []));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage('auditLogs', []));
  const [settings, setSettings] = useState<SystemSettings>(() => loadStorage('settings', {} as SystemSettings));
  const [notifications, setNotifications] = useState<any[]>([]);
'''

# Find where to insert them
pattern = r'(const \[services, setServices\] = useState<ServiceItem\[\]>\(\(\) =>\s*loadStorage\(\'services\', \[\]\)\s*\);)'
c = re.sub(pattern, r'\1\n' + states_to_add, c)

with open('e:/dbclient/admin/src/context/AdminContext.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print('AdminContext states restored')
