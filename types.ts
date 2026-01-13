
export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}

export interface LandReportData {
  measurement1: string;
  measurement2: string;
  notes: string;
}
