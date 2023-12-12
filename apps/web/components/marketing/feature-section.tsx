import { CardHeader, CardContent, Card } from '@/components/ui/card';

export const FeatureSection: React.FC = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="mb-6 text-center text-3xl font-bold">Key Features</h2>
        <div className="grid items-start gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Automated Workflows</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Automate repetitive tasks and focus on what matters. Our CRM
                does the heavy lifting for you.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Customer Segmentation</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Segment customers based on behavior, demographics, and more to
                drive targeted campaigns.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Detailed Analytics</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Get deep insights into customer behavior and campaign
                performance with our analytics tools.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
