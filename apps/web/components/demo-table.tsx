import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Attribute, Contact } from '@prisma/client';

const colorConfig = {
  gray: 'bg-gray-100 text-gray-900',
  blue: 'bg-blue-100 text-blue-900',
  green: 'bg-green-100 text-green-900',
  yellow: 'bg-yellow-100 text-yellow-900',
  orange: 'bg-orange-100 text-orange-900',
  red: 'bg-red-100 text-red-900',
};

export async function TableDemo({
  attributes,
  data,
}: {
  attributes: Attribute[];
  data: Contact[];
}) {
  const headers = attributes.map(attribute => attribute.label);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map(header => (
            <TableCell key={header}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map(contact => (
          <TableRow key={contact.id}>
            {attributes.map(attribute => (
              <AttributeRender
                key={attribute.id}
                attribute={attribute}
                contact={contact}
              />
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AttributeRender({
  attribute,
  contact,
}: {
  attribute: Attribute;
  contact: Contact;
}) {
  const value = (contact.attributes as Record<string, any>)[attribute.id];

  // @ts-expect-error needs different approach anyway
  if (attribute.type === 'SELECT' && attribute.config?.options.length) {
    // @ts-expect-error needs different approach anyway
    const option = attribute.config.options.find(
      // @ts-expect-error needs different approach anyway
      option => option.value === value
    );

    if (option) {
      return (
        // @ts-expect-error needs different approach anyway
        <TableCell className={colorConfig[option.color]}>
          {option.label}
        </TableCell>
      );
    }
  }

  return <TableCell>{value}</TableCell>;
}
