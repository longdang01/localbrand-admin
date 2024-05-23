import { useGetByIdProduct } from '@/loaders/product.loader';
import { InvoiceDetailProps } from '@/models/invoice-detail';
import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import { ProductSizeProps } from '@/models/product-size';
import ModalRender from '@/modules/shared/modal/ModalRender';
import { useInvoiceDetailState } from '@/stores/invoice-detail.store';
import { useDisclosure } from '@/utils/modal';
import { RULES_FORM } from '@/utils/validator';
import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Select,
    Tooltip,
    Typography,
    notification,
    theme,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const { useToken } = theme;

interface Props {
    id?: string;
}

const CreateProductModal = ({ id }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const { isOpen, open, close } = useDisclosure();
    const { token } = useToken();

    const [form] = useForm();
    const [invoiceDetails, setInvoiceDetails] = useInvoiceDetailState((state) => [state.invoiceDetails, state.setInvoiceDetails]);
    const [choosedColor, setChoosedColor] = useState<ProductColorsProps>();
    const [choosedSize, setChoosedSize] = useState<ProductSizeProps>();

    const currentProduct = useGetByIdProduct({
        id: id || '',
        config: {
            onSuccess: (response) => {
                form.setFieldsValue({
                    ...response,
                });
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
        enabled: isOpen,
    });

    const handleOpen = () => {
        open();
    };

    const handleClose = () => {
        close();
    };

    const handleChoosedColor = (e: any) => {
        const color = currentProduct?.data?.colors?.find(
            (color: ProductColorsProps) => color?._id == e,
        );

        form.setFieldValue("color_id", e);
        setChoosedColor(color);
        setChoosedSize(undefined);
        form.setFieldValue("size_id", null);
    };

    const handleChoosedSize = (e: any) => {
        form.setFieldValue("size_id", e);
        setChoosedSize(
            choosedColor?.sizes?.find(
                (size: ProductSizeProps) => size?._id == e,
            ),
        );
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                const checkExisted = invoiceDetails?.find((invoiceDetail:InvoiceDetailProps) => 
                    (invoiceDetail?.product as ProductProps)?._id == currentProduct?.data?._id && 
                    (invoiceDetail?.color as ProductColorsProps)?._id == choosedColor?._id && 
                    (invoiceDetail?.size as ProductSizeProps)?._id == choosedSize?._id
                ) 

                if(checkExisted) {
                    notification.warning({
                        message: t('invoice.create_product_warning'),
                    });
                    return;
                }

                setInvoiceDetails([
                    {
                        ...values,
                        product: currentProduct?.data,
                        color: choosedColor,
                        size: choosedSize

                    },
                    ...invoiceDetails,
                ])

                handleClose?.();
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    return (
        <>
            <ModalRender
                customHeader={true}
                title={
                    <Typography.Text>
                        {t('invoice.product_info')}
                    </Typography.Text>
                }
                buttonRender={
                    <Tooltip title={t('invoice.import')}>
                        <Button
                            type="primary"
                            shape="circle"
                            icon={<PlusOutlined />}
                            onClick={handleOpen}
                        />
                    </Tooltip>
                }
                open={isOpen}
                handleCancel={handleClose}
                handleSubmit={handleSubmit}
            >
                {currentProduct?.isLoading ? (
                    <Flex
                        align="center"
                        justify="center"
                        style={{ height: '100%' }}
                    >
                        <div
                            className="loader"
                            style={{ background: token.colorPrimary }}
                        ></div>
                    </Flex>
                ) : (
                    <Form form={form} layout="vertical">
                        <FormItem
                            labelCol={{ span: 7 }}
                            name="productName"
                            label={t('invoice.fields.product')}
                            rules={[...RULES_FORM.required]}
                        >
                            <Input
                                placeholder={t('invoice.fields.product')}
                                readOnly
                            />
                        </FormItem>
                        <Row gutter={24}>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('invoice.fields.color')}
                                    name="color_id"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Row gutter={0}>
                                        <Col span={22} md={22} lg={22}>
                                            <Select
                                                onSelect={handleChoosedColor}
                                                options={currentProduct?.data?.colors?.map(
                                                    (
                                                        color: ProductColorsProps,
                                                    ) => ({
                                                        label: color?.colorName,
                                                        value: color?._id,
                                                    }),
                                                )}
                                                placeholder={t(
                                                    'invoice.fields.color',
                                                )}
                                            />
                                        </Col>
                                        <Col span={2} md={2} lg={2}>
                                            <Flex justify="end">
                                                <Button
                                                    type="text"
                                                    style={{
                                                        backgroundColor:
                                                            choosedColor?.hex,
                                                        border: "1px solid #d6d6d6"
                                                    }}
                                                />
                                            </Flex>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </Col>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('invoice.fields.size')}
                                    name="size_id"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Select
                                        onSelect={handleChoosedSize}
                                        options={choosedColor?.sizes?.map(
                                            (size: ProductSizeProps) => ({
                                                label: size?.sizeName,
                                                value: size?._id,
                                            }),
                                        )}
                                        placeholder={t('invoice.fields.size')}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('invoice.fields.quantity')}
                                    name="quantity"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.number,
                                    ]}
                                >
                                    <Input
                                        placeholder={t(
                                            'invoice.fields.quantity',
                                        )}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                            </Col>
                            <Col span={24} md={12} lg={12}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('invoice.fields.price_import')}
                                    name="priceImport"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.number,
                                    ]}
                                >
                                    <Input
                                        placeholder={t(
                                            'invoice.fields.price_import',
                                        )}
                                        style={{ width: '100%' }}
                                    />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                )}
            </ModalRender>
        </>
    );
};

export default CreateProductModal;
