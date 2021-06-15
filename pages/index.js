import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Flex,
  Button,
  Container,
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Th,
  Td,
  TableCaption,
  StatArrow,
  Tr,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { kebabCase, last } from "lodash";
import axios from "axios";
import toast from "react-hot-toast";

export default function Home() {
  const [countryKpi, setCountryKpi] = useState([]);
  const [country, setCountry] = useState();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, watch, errors } = useForm();
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const req = await axios.get("https://countrynomics-api.herokuapp.com/api/economics", {
        params: {
          country: values.country,
        },
      });
      setCountryKpi(req.data.kpis);
      setLoading(false);
      toast.success(`Economics of ${country} retrieved!`);
    } catch (e) {
      toast.error("An error occurred...");
    }

    // if (!data) {
    // 	toast.error("An error occurred.");
    // }
    // .then((data) => {
    // 	toast.success("Data retrieved!");
    // 	setCountryData(res.general);
    // 	setLoading(false);
    // })
    // .catch((e) => {
    // 	toast.error("An error occurred.");
    // 	console.log(e.message);
    // 	setLoading(false);
    // });
  };
  return (
    <Container maxW="container.lg">
      <VStack spacing="24px" alignItems="center">
        <Box>
          <Heading as="h1" size="2xl" pb="12px">
            Countrynomics 📈
          </Heading>
          <Text as="h2" size="md" color="gray.600">
            Access economics indicators of any country!
          </Text>
        </Box>
        <Heading>{country}</Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HStack spacing="12px" alignItems="center">
            <Input ref={register()} onChange={(e) => setCountry(e.target.value)} name="country" />
            <Button
              rightIcon={<ArrowForwardIcon />}
              isLoading={loading}
              colorScheme="teal"
              type="submit"
              padding="1.25em"
            >
              Search
            </Button>
          </HStack>
        </form>
        <EconomicsTable countryKpi={countryKpi} />
      </VStack>
    </Container>
  );
}

const EconomicsTable = ({ countryKpi }) => (
  <Box w="100%" overflow="auto">
    <Table size="sm">
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>Last</Th>
          <Th>Reference</Th>
          <Th>Previous</Th>
          <Th>Range</Th>
          <Th>Frequency</Th>
        </Tr>
      </Thead>
      <Tbody>
        {countryKpi?.map((kpi) => {
          const isPercentage = kpi.overview.includes("%");
          // console.log(isPercentage, typeof kpi.overview);
          return (
            <Tr>
              <Td>
                <Heading size="xs">{kpi.overview}</Heading>
              </Td>
              <Td>{kpi.last}</Td>
              <Td>{kpi.reference}</Td>
              <Td>{kpi.previous}</Td>
              <Td>{kpi.range}</Td>
              <Td>{kpi.frequency}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  </Box>
);
