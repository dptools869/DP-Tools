
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const gradePoints: { [key: string]: number } = {
  'A+': 4.0, 'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0, 'F': 0.0,
};

type Course = {
  id: number;
  grade: string;
  credits: string;
};

export default function GpaCalculatorPage() {
  const [courses, setCourses] = useState<Course[]>([
    { id: 1, grade: 'A', credits: '3' },
    { id: 2, grade: 'B+', credits: '4' },
    { id: 3, grade: 'A-', credits: '3' },
  ]);

  const handleCourseChange = (id: number, field: 'grade' | 'credits', value: string) => {
    setCourses(courses.map(course =>
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), grade: 'A', credits: '3' }]);
  };

  const removeCourse = (id: number) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const { gpa, totalCredits } = useMemo(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits);
      const points = gradePoints[course.grade];

      if (!isNaN(credits) && credits > 0 && points !== undefined) {
        totalPoints += points * credits;
        totalCredits += credits;
      }
    });

    if (totalCredits === 0) {
      return { gpa: '0.00', totalCredits: 0 };
    }

    const gpa = (totalPoints / totalCredits).toFixed(2);
    return { gpa, totalCredits };
  }, [courses]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <GraduationCap className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">GPA Calculator</CardTitle>
              <CardDescription className="text-lg">
                Calculate your Grade Point Average quickly and accurately.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Your Courses</CardTitle>
                <CardDescription>Add your courses, grades, and credit hours to calculate your GPA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-[2fr_1fr_auto] gap-x-4 font-medium px-2 text-muted-foreground">
                    <Label>Grade</Label>
                    <Label>Credits</Label>
                    <span className="w-8"></span>
                </div>
                {courses.map((course, index) => (
                  <div key={course.id} className="grid grid-cols-[2fr_1fr_auto] gap-x-4 items-center">
                    <Select value={course.grade} onValueChange={(val) => handleCourseChange(course.id, 'grade', val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(gradePoints).map(grade => (
                          <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="e.g., 3" value={course.credits} onChange={e => handleCourseChange(course.id, 'credits', e.target.value)} />
                    <Button variant="ghost" size="icon" onClick={() => removeCourse(course.id)} aria-label="Remove course">
                        <Trash2 className="w-5 h-5 text-destructive" />
                    </Button>
                  </div>
                ))}
                 <Button onClick={addCourse} variant="outline" className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add Course
                </Button>
              </CardContent>
              <CardFooter className="bg-muted/50 p-6 rounded-b-lg flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
                  <div>
                    <Label className="text-sm font-normal">Total Credits</Label>
                    <div className="text-3xl font-bold text-primary">{totalCredits}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-normal">Your GPA</Label>
                    <div className="text-5xl font-bold text-primary">{gpa}</div>
                  </div>
              </CardFooter>
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Calculate Your GPA</h2>
            <p>Your Grade Point Average (GPA) is a standard way of measuring academic achievement. Our calculator makes it easy, but understanding the formula can help you track your progress. Here's how it works:</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>The GPA Formula</h3>
             <ol>
              <li><strong>Assign Grade Points:</strong> Each letter grade corresponds to a point value. A common scale is A=4, B=3, C=2, D=1, F=0.</li>
              <li><strong>Calculate Quality Points for Each Course:</strong> Multiply the grade point for each course by the number of credits for that course. (Grade Points * Credits = Quality Points).</li>
              <li><strong>Sum Your Totals:</strong> Add up all your quality points and all your credit hours.</li>
              <li><strong>Divide:</strong> Divide your total quality points by your total credit hours. The result is your GPA.</li>
            </ol>
            <p>Our calculator automates these steps, providing a quick and error-free way to determine your GPA. This is especially helpful for planning future semesters and understanding your academic standing.</p>
          </article>

          <AdBanner type="bottom-banner" className="mt-12" />
        </main>
        
        <aside className="space-y-8 lg:sticky top-24 self-start">
          <AdBanner type="sidebar" />
          <AdBanner type="sidebar" />
        </aside>
      </div>
    </div>
  );
}
