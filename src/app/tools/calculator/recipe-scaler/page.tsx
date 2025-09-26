
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Soup, Plus, Trash2 } from 'lucide-react';
import AdBanner from '@/components/ad-banner';

type Ingredient = {
  id: number;
  name: string;
  quantity: string;
  unit: string;
};

export default function RecipeScalerPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: 1, name: 'Flour', quantity: '2', unit: 'cups' },
    { id: 2, name: 'Sugar', quantity: '1', unit: 'cup' },
    { id: 3, name: 'Eggs', quantity: '2', unit: '' },
  ]);
  const [scaleFactor, setScaleFactor] = useState('2');

  const handleIngredientChange = (id: number, field: keyof Omit<Ingredient, 'id'>, value: string) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };
  
  const scaledIngredients = useMemo(() => {
    const factor = parseFloat(scaleFactor);
    if (isNaN(factor) || factor <= 0) return [];
    
    return ingredients.map(ing => {
        const originalQty = parseFloat(ing.quantity);
        if(isNaN(originalQty)) return { ...ing, scaledQuantity: ''};

        const scaledQty = originalQty * factor;
        
        // Handle fractions for common units if desired, for now use decimals
        const displayQty = Number.isInteger(scaledQty) 
                           ? scaledQty.toString() 
                           : scaledQty.toFixed(2).replace(/\.?0+$/, ''); // Remove trailing zeros
                           
        return { ...ing, scaledQuantity: displayQty };
    });
  }, [ingredients, scaleFactor]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <main className="lg:col-span-3">
          <Card className="shadow-2xl shadow-primary/10 border-primary/20 bg-card/80 backdrop-blur-sm mb-16">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Soup className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl font-headline">Recipe Scaler</CardTitle>
              <CardDescription className="text-lg">
                Easily scale your recipe ingredients up or down.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
              <CardHeader>
                <CardTitle>Scale Your Recipe</CardTitle>
                <CardDescription>Enter your ingredients and a scaling factor to get the new amounts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="scale-factor">Scaling Factor</Label>
                        <Input id="scale-factor" type="number" placeholder="e.g., 2 for double" value={scaleFactor} onChange={(e) => setScaleFactor(e.target.value)} />
                        <p className="text-xs text-muted-foreground">E.g., 2 for double, 0.5 for half.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 font-medium text-muted-foreground px-2">
                        <span>Ingredient Name</span>
                        <span>Quantity</span>
                        <span>Unit</span>
                        <span className="w-8"></span>
                    </div>
                    {ingredients.map((ingredient) => (
                      <div key={ingredient.id} className="grid grid-cols-[1fr_auto_auto_auto] gap-x-2 items-center">
                        <Input placeholder="e.g., Flour" value={ingredient.name} onChange={(e) => handleIngredientChange(ingredient.id, 'name', e.target.value)} />
                        <Input type="number" className="w-24" placeholder="e.g., 2" value={ingredient.quantity} onChange={(e) => handleIngredientChange(ingredient.id, 'quantity', e.target.value)} />
                        <Input className="w-24" placeholder="e.g., cups" value={ingredient.unit} onChange={(e) => handleIngredientChange(ingredient.id, 'unit', e.target.value)} />
                        <Button variant="ghost" size="icon" onClick={() => removeIngredient(ingredient.id)} aria-label="Remove ingredient">
                            <Trash2 className="w-5 h-5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button onClick={addIngredient} variant="outline" className="w-full">
                        <Plus className="mr-2 h-4 w-4" /> Add Ingredient
                    </Button>
                </div>
              </CardContent>
              {scaledIngredients.length > 0 && (
                <CardFooter className="flex-col items-start p-6 bg-muted/50 rounded-b-lg">
                    <h3 className="text-xl font-bold mb-4">Scaled Recipe</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        {scaledIngredients.map(ing => (
                            <li key={ing.id}>
                                <span className="font-semibold">{ing.scaledQuantity} {ing.unit}</span> {ing.name}
                            </li>
                        ))}
                    </ul>
                </CardFooter>
              )}
            </Card>
          
          <article className="mt-16 prose prose-lg dark:prose-invert max-w-none prose-h2:font-headline prose-h2:text-3xl prose-h2:text-primary prose-a:text-primary">
            <h2>How to Scale a Recipe Correctly</h2>
            <p>Scaling a recipe—adjusting the ingredient quantities to make a larger or smaller batch—is a common kitchen task. Our Recipe Scaler makes the math easy, but understanding the principles will help you achieve perfect results every time.</p>
            <AdBanner type="top-banner" className="my-8"/>
            <h3>1. Find Your Scaling Factor</h3>
            <p>The first step is to determine your scaling factor. This is done by dividing the desired number of servings by the original number of servings. For example, if a recipe serves 4 people and you want to make it for 6, your scaling factor is <code>6 / 4 = 1.5</code>. To halve a recipe, the factor is 0.5. To double it, the factor is 2.</p>

            <h3>2. Multiply Your Ingredients</h3>
            <p>Once you have your scaling factor, multiply the quantity of each ingredient by this number. Our calculator automates this for you. Just enter your original ingredients and the scaling factor, and we'll provide the new measurements.</p>
            
            <h3>Tips for Successful Scaling</h3>
            <ul>
              <li><strong>By Weight is Best:</strong> If possible, use weights (like grams) instead of volumes (like cups) for dry ingredients, as it's much more accurate.</li>
              <li><strong>Be Careful with Spices:</strong> Spices and seasonings might not scale linearly. It's often best to start with a slightly smaller amount than calculated, then taste and adjust.</li>
              <li><strong>Adjust Cooking Time:</strong> A larger batch may require a longer cooking time, while a smaller batch may cook faster. Keep an eye on your dish.</li>
              <li><strong>Consider Pan Size:</strong> When scaling up or down, you may need to use a different sized pan to ensure even cooking.</li>
            </ul>
            <p>Our Recipe Scaler is the perfect tool for quickly adjusting any recipe, taking the guesswork out of your kitchen conversions.</p>
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
