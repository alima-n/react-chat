const getValueByProp = (propertyName, value) => () => ({
    [propertyName]: value,
})

export default getValueByProp