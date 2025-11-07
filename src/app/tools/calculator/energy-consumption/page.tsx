
import type { Metadata } from 'next';
import { EnergyCalculatorClient } from './client';

export const metadata: Metadata = {
    title: 'Free Energy Consumption Calculator | Estimate Your Home Usage',
    description: 'Quickly calculate appliance energy use and costs. Enter watts, hours, and electricity rate to get instant daily, monthly, and yearly energy and cost estimates.',
    keywords: [
        'carbon footprint calculator',
        'energy cost calculator',
        'energy consumption calculator',
        'electricity usage calculator',
        'energy consumption estimator',
        'appliance energy calculator',
        'appliance wattage calculator',
        'calculate energy usage',
        'energy efficiency calculator',
        'home energy calculator'
    ]
};

export default function EnergyConsumptionCalculatorPage() {
    return <EnergyCalculatorClient />;
}
