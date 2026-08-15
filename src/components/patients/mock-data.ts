export interface Patient {
  id: string
  name: string
  familyMember: string
  caregiver: string
  subscription: "Active" | "Grace Period" | "Expired"
  status: "Active" | "Inactive"
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: "1",
    name: "Justice Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
  {
    id: "2",
    name: "Dean Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Grace Period",
    status: "Inactive",
  },
  {
    id: "3",
    name: "Dean Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Expired",
    status: "Active",
  },
  {
    id: "4",
    name: "Dean Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Inactive",
  },
  {
    id: "5",
    name: "Dean Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
  {
    id: "6",
    name: "Dean Winchester",
    familyMember: "Sam Winchester",
    caregiver: "Bobby Singer",
    subscription: "Grace Period",
    status: "Active",
  },
  // Additional mock data for pagination
  {
    id: "7",
    name: "Castiel Novak",
    familyMember: "Jimmy Novak",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
  {
    id: "8",
    name: "Jack Kline",
    familyMember: "Kelly Kline",
    caregiver: "Bobby Singer",
    subscription: "Expired",
    status: "Inactive",
  },
  {
    id: "9",
    name: "Crowley MacLeod",
    familyMember: "Rowena MacLeod",
    caregiver: "Bobby Singer",
    subscription: "Grace Period",
    status: "Active",
  },
  {
    id: "10",
    name: "John Winchester",
    familyMember: "Mary Winchester",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
  {
    id: "11",
    name: "Arthur Ketch",
    familyMember: "Mick Davies",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Inactive",
  },
  {
    id: "12",
    name: "Jody Mills",
    familyMember: "Donna Hanscum",
    caregiver: "Bobby Singer",
    subscription: "Grace Period",
    status: "Active",
  },
  {
    id: "13",
    name: "Claire Novak",
    familyMember: "Alex Jones",
    caregiver: "Bobby Singer",
    subscription: "Expired",
    status: "Inactive",
  },
  {
    id: "14",
    name: "Charlie Bradbury",
    familyMember: "Gilda Wood",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
  {
    id: "15",
    name: "Balthazar Grace",
    familyMember: "Gabriel Angel",
    caregiver: "Bobby Singer",
    subscription: "Active",
    status: "Active",
  },
]
