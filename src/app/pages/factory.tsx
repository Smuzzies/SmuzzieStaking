import { TokenFactory } from '../components/TokenFactory';
import { NFTFactory } from '../components/NFTFactory';
import { StakingFactory } from '../components/StakingFactory';

export default function FactoryPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-8">Launch New Contracts</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TokenFactory />
                <NFTFactory />
                <StakingFactory />
            </div>
        </div>
    );
} 