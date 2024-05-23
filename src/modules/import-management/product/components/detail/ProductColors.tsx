import { ProductProps } from '@/models/product';
import { ProductColorsProps } from '@/models/product-color';
import Toolbars from '@/modules/shared/toolbars/Toolbars';
import {
    Button,
    Col,
    Flex,
    Form,
    Input,
    Row,
    Tooltip,
    notification,
} from 'antd';
import { useTranslation } from 'react-i18next';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { SketchPicker } from 'react-color';
import { getColorName, presetColors } from '@/utils/colors-picker';
import classes from '../../scss/product.module.scss';
import { useForm } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { RULES_FORM } from '@/utils/validator';
import { useState } from 'react';
import {
    useCreateColor,
    useRemoveColor,
    useUpdateColor,
} from '@/loaders/color.loader';
import { queryClient } from '@/lib/react-query';
import { CACHE_PRODUCT } from '@/loaders/product.loader';
import ConfirmRender from '@/modules/shared/modal/confirm/ConfirmRender';
import ProductSizes from './ProductSizes';
import ProductDiscounts from './ProductDiscounts';
import ProductGallery from './ProductGallery';
import { TiArrowBackOutline } from "react-icons/ti";

interface Props {
    product?: ProductProps;
}

const ProductColors = ({ product }: Props) => {
    const { t } = useTranslation('translation', { keyPrefix: 'import' });
    const [form] = useForm();
    const [choosedColor, setChoosedColor] = useState<ProductColorsProps>();

    const createColor = useCreateColor({
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_PRODUCT.GET_BY_PATH]);

                notification.success({
                    message: t('product.create_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const updateColor = useUpdateColor({
        id: choosedColor?._id || '',
        config: {
            onSuccess: (_) => {
                queryClient.invalidateQueries([CACHE_PRODUCT.GET_BY_PATH]);

                notification.success({
                    message: t('product.update_success'),
                });

                handleRefresh();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const deleteColor = useRemoveColor({
        config: {
            onSuccess: () => {
                queryClient.invalidateQueries([CACHE_PRODUCT.GET_BY_PATH]);

                notification.success({
                    message: t('product.delete_success'),
                });

                handleRefresh?.();
            },
            onError: (error: any) => {
                notification.error({
                    message: error?.message,
                });
            },
        },
    });

    const handleChoosedColor = (color: ProductColorsProps) => {
        setChoosedColor(color);
        form.setFieldsValue({
            ...color,
            priceImport: color?.priceImport || t('product.not_price_import'),
        });
    };

    const handleRefresh = () => {
        form.resetFields();
        setChoosedColor(undefined);
    };

    const handleSubmit = () => {
        form.validateFields()
            .then(async (values) => {
                if (choosedColor?._id) {
                    updateColor.mutate({
                        ...values,
                        product: product,
                    });
                } else {
                    createColor.mutate({
                        ...values,
                        product: product,
                    });
                }
            })
            .catch(() => {
                notification.warning({
                    message: t('product.validate_form'),
                });
            });
    };

    const handleDelete = () => {
        deleteColor.mutate(choosedColor?._id || '');
    };

    const handleBack = () => {
        window.history.back();
    }

    return (
        <>
            <Toolbars
                left={
                    <>
                        <Flex align="center">
                            <Tooltip title={t("product.back")}>
                                <Button
                                    type='primary'
                                    shape="circle"
                                    icon={<TiArrowBackOutline />}
                                    onClick={() => handleBack()}
                                />
                            </Tooltip>

                            {product?.colors?.map(
                                (color: ProductColorsProps) => (
                                    <>
                                        <Tooltip title={color?.colorName}>
                                            <Button
                                                shape="circle"
                                                onClick={() =>
                                                    handleChoosedColor(color)
                                                }
                                                style={{
                                                    backgroundColor: color?.hex,
                                                }}
                                            />
                                        </Tooltip>
                                    </>
                                ),
                            )}
                        </Flex>
                    </>
                }
                right={
                    <>
                        <Flex align="center" justify="end">
                            <ProductSizes choosedColor={choosedColor} />

                            <ProductGallery choosedColor={choosedColor} />

                            <ProductDiscounts choosedColor={choosedColor} />
                        </Flex>
                    </>
                }
            />

            <div className="layout">
                <Row gutter={[24, 24]}>
                    <Col span={24} md={10} lg={10}>
                        <div className={classes.sketchContainer}>
                            <SketchPicker
                                disableAlpha
                                color={choosedColor?.hex || '#000000'}
                                presetColors={presetColors}
                                onChange={({ hex }) => {
                                    const { name }: any = getColorName(hex);

                                    form.setFieldsValue({
                                        ...choosedColor,
                                        colorName: name,
                                        hex: hex,
                                    });
                                    setChoosedColor({
                                        ...choosedColor,
                                        colorName: name,
                                        hex: hex,
                                    });
                                }}
                            />
                        </div>
                    </Col>
                    <Col span={24} md={14} lg={14}>
                        <div className="layout-horizontal">
                            <Form form={form}>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.color_selected')}
                                    required
                                >
                                    <Input
                                        style={{
                                            background: choosedColor?.hex,
                                        }}
                                        className={classes.colorBar}
                                    />
                                </FormItem>

                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.color_name')}
                                    name="colorName"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.color_name')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.color_hex')}
                                    name="hex"
                                    rules={[...RULES_FORM.required]}
                                >
                                    <Input
                                        placeholder={t('product.color_hex')}
                                    />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={t('product.price')}
                                    name="price"
                                    rules={[
                                        ...RULES_FORM.required,
                                        ...RULES_FORM.number,
                                    ]}
                                >
                                    <Input placeholder={t('product.price')} />
                                </FormItem>
                                <FormItem
                                    labelCol={{ span: 7 }}
                                    label={
                                        <div style={{ marginLeft: 10 }}>
                                            {t('product.price_import')}
                                        </div>
                                    }
                                    name="priceImport"
                                    rules={[...RULES_FORM.number]}
                                    hidden={!choosedColor?._id}
                                >
                                    <Input
                                        placeholder={t('product.price_import')}
                                        readOnly
                                    />
                                </FormItem>
                            </Form>
                            <Flex align="center" justify="end">
                                <Tooltip title={t('product.create_color')}>
                                    <Button
                                        loading={createColor?.isLoading}
                                        type="primary"
                                        shape="circle"
                                        icon={<PlusOutlined />}
                                        onClick={handleSubmit}
                                        style={{ marginLeft: 10 }}
                                        disabled={!!choosedColor?._id}
                                    />
                                </Tooltip>
                                <Tooltip title={t('product.update_color')}>
                                    <Button
                                        loading={updateColor?.isLoading}
                                        type="primary"
                                        shape="circle"
                                        icon={<EditOutlined />}
                                        onClick={handleSubmit}
                                        style={{ marginLeft: 10 }}
                                        disabled={!choosedColor?._id}
                                    />
                                </Tooltip>
                                <ConfirmRender
                                    buttonRender={
                                        <Tooltip
                                            title={t('product.delete_color')}
                                        >
                                            <Button
                                                loading={deleteColor?.isLoading}
                                                shape="circle"
                                                icon={<DeleteOutlined />}
                                                className="btn-delete"
                                                style={{ marginLeft: 10 }}
                                                disabled={!choosedColor?._id}
                                            />
                                        </Tooltip>
                                    }
                                    handleConfirm={() => handleDelete()}
                                    content={t('product.confirm_delete_color')}
                                    title={t('product.confirm_delete_title')}
                                />

                                <Tooltip title={t('product.refresh')}>
                                    <Button
                                        shape="circle"
                                        icon={<ReloadOutlined />}
                                        onClick={() => handleRefresh()}
                                        style={{ marginLeft: 10 }}
                                        className="btn-refresh"
                                    />
                                </Tooltip>
                            </Flex>
                        </div>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default ProductColors;
