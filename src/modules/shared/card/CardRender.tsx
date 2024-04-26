import { Card } from 'antd';

interface Props {
    imageSrc?: string;
    children?: React.ReactNode;
    metaTitle?: string;
    metaDescription?: string;
}
const { Meta } = Card;

const CardRender = ({
    imageSrc,
    children,
    metaTitle,
    metaDescription,
}: Props) => {
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={
                <img
                    src={imageSrc}
                />
            }
        >
            {children || (
                <Meta title={metaTitle} description={metaDescription} />
            )}
        </Card>
    );
};

export default CardRender;
