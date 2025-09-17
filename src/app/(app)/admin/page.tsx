// src/app/(app)/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminPage() {
  const [users, setUsers] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        setUsers(querySnapshot.docs);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold flex items-center gap-3">
            <Shield className="text-primary"/> Admin Dashboard
        </h1>
        <p className="text-muted-foreground">Monitor application performance and user activity.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Users</CardTitle>
          <CardDescription>A list of all users who have registered on the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
             </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Display Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userDoc) => {
                    const userData = userDoc.data();
                    return (
                        <TableRow key={userDoc.id}>
                            <TableCell className="font-medium">{userData.displayName || 'N/A'}</TableCell>
                            <TableCell>{userData.email}</TableCell>
                            <TableCell>
                                <Badge variant={userData.role === 'admin' ? 'destructive' : 'secondary'}>
                                    {userData.role}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                {userData.createdAt?.toDate ? format(userData.createdAt.toDate(), 'PPP') : 'N/A'}
                            </TableCell>
                        </TableRow>
                    )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
