
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fixers, provinces, skills, statuses } from "@/data/mockData";

const Dashboard: React.FC = () => {
  const totalFixers = fixers.length;
  const activeFixers = fixers.filter(fixer => fixer.status_id === 'active').length;
  const averageCompletionRate = Math.round(
    fixers.reduce((sum, fixer) => sum + (fixer.completion_rate || 0), 0) / totalFixers
  );
  const totalJobs = fixers.reduce((sum, fixer) => sum + (fixer.total_jobs || 0), 0);

  // Generate data for charts
  const statusData = statuses.map(status => ({
    name: status.name,
    value: fixers.filter(fixer => fixer.status_id === status.id).length
  }));

  const provinceData = provinces.map(province => ({
    name: province.name,
    count: fixers.filter(fixer => fixer.province_id === province.id).length
  }));

  const skillData = skills.map(skill => ({
    name: skill.name,
    count: fixers.filter(fixer => fixer.skills.includes(skill.id)).length
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Fixers</CardDescription>
            <CardTitle className="text-3xl">{totalFixers}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {activeFixers} active fixers ({Math.round((activeFixers / totalFixers) * 100)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jobs Completed</CardDescription>
            <CardTitle className="text-3xl">{totalJobs.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Average {Math.round(totalJobs / activeFixers)} per active fixer
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Completion Rate</CardDescription>
            <CardTitle className="text-3xl">{averageCompletionRate}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Based on {totalFixers} fixers
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Provinces Covered</CardDescription>
            <CardTitle className="text-3xl">{provinces.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              With {activeFixers} active fixers
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fixers by Province</CardTitle>
            <CardDescription>Distribution of fixers across provinces</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provinceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#FF6700" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fixers by Skill</CardTitle>
            <CardDescription>Number of fixers with each skill</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={skillData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#2f2f2f" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
