import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const Manage = () => {
  const proposals = [
    { id: 1, comedian: 'Jane Smith', date: '2024-02-15', type: 'Stand-up', status: 'Pending' },
    { id: 2, comedian: 'Mike Jones', date: '2024-02-20', type: 'Open Mic', status: 'Approved' }
  ];

  return (
    <div className="p-6">
      <Tabs defaultValue="proposals">
        <TabsList>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="approved">Approved Events</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="proposals" className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comedian</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposals.map((proposal) => (
                <TableRow key={proposal.id}>
                  <TableCell>{proposal.comedian}</TableCell>
                  <TableCell>{proposal.date}</TableCell>
                  <TableCell>{proposal.type}</TableCell>
                  <TableCell>{proposal.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm">View</Button>
                    <Button variant="default" size="sm">Approve</Button>
                    <Button variant="destructive" size="sm">Reject</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Manage;
