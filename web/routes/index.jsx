

import React, { useState, useEffect } from "react";
import { Card, Layout, Page, TextField, Pagination, DataTable, Button, BlockStack } from "@shopify/polaris";
import { useFindMany } from "@gadgetinc/react";
import { api } from "../api";
export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [{ data, error, fetching }] = useFindMany(api.draftedProduct, {});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showMore, setShowMore] = useState({}); // To manage the show more/less state for each order

  // Handle search input change
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Clear search input and hide clear button
  const clearSearch = () => {
    setSearchTerm(""); // Clear search term
  };

  useEffect(() => {
    if (data) {
      const filtered = data?.filter((order) =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [data, searchTerm]);

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  if (fetching) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <Page title="Drafted Orders">
      <Layout>
        <Layout.Section>
          <BlockStack> {/* Ensure full width */}
            <Card>
              <TextField
                label="Search Orders"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Order ID or Product Title"
                clearButton
                onClearButtonClick={clearSearch}
              />
              {/* If there are no products that match the search */}
              {filteredOrders.length === 0 ? (
                  <p style={{marginTop:"10px",fontWeight:"bold",textAlign:'center'}}> No Products Found.</p>
             
              ) : (
                <>
                 <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text']}
                    headings={[
                      <span style={{ fontWeight: 'bold' }}>Order ID</span>,
                      <span style={{ fontWeight: 'bold' }}>Created At</span>,
                      <span style={{ fontWeight: 'bold' }}>Product Type</span>,
                      <span style={{ fontWeight: 'bold' }}>SwatchId</span>,
                      <span style={{ fontWeight: 'bold' }}>Product Title</span>,
                    
                      <span style={{ fontWeight: 'bold' }}>RelatedProduct IDs</span>,
                    ]}
                    rows={paginatedOrders.map((order) => {
                      const variantIds = order.relatedProduct || []; // Use the correct field name
                      const showMoreButton = showMore[order.productId];

                      return [
                        order.orderId,
                        new Date(order.createdAt).toLocaleDateString(),
                        order.type,
                        order.swatchId,
                        order.productTitle,
                      
                        <div>
                          {variantIds.slice(0, showMoreButton ? variantIds.length : 3).map((id, index) => (
                            <div key={index}>{id}</div> // Display each variant ID vertically
                          ))}
                          {variantIds.length > 3 && (
                            <Button onClick={() => setShowMore((prev) => ({ ...prev, [order.productId]: !prev[order.productId] }))}>
                              {showMoreButton ? "Show Less" : "Show More"}
                            </Button>
                          )}
                        </div>,
                      ];
                    })}
                  />

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      label={`Page ${currentPage} of ${totalPages}`}
                      hasPrevious={currentPage > 1}
                      onPrevious={() => setCurrentPage(currentPage - 1)}
                      hasNext={currentPage < totalPages}
                      onNext={() => setCurrentPage(currentPage + 1)}
                    />
                  )}
                </>
              )}
            </Card>
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
  
}