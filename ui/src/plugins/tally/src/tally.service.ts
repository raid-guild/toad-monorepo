import { TallyApi } from "./api";
import { getAllProposalsParameters, getProposalByIdParameters, getProposalByNameParameters } from "./parameters";
import { organizationQuery, proposalsQuery, proposalQuery } from "./constants";


interface Organization {
    id: string;
    governorIds: string[];
    proposalsCount: number;
}

export class TallyService {
    private tallyApi: TallyApi;
    private organization: Organization | null = null;
    private initializationPromise: Promise<void> | null = null;

    constructor(apiKey: string, organizationName: string, chainId: string) {
        if (!apiKey) {
            throw new Error("Tally API key is required");
        }
        this.tallyApi = new TallyApi(apiKey, organizationName, chainId);
        this.initializationPromise = this.initializeOrganization();
    }

    private async initializeOrganization() {
        try {
            console.log("Initializing Tally organization...");
            this.organization = await this.getOrganization();
            if (this.organization) {
                console.log("Tally organization initialized successfully:", {
                    id: this.organization.id,
                    governorIds: this.organization.governorIds,
                    proposalsCount: this.organization.proposalsCount
                });
            } else {
                throw new Error("Failed to get organization data");
            }
        } catch (error) {
            console.error("Failed to initialize Tally organization:", error);
            throw error;
        }
    }

    private async ensureInitialized() {
        if (!this.initializationPromise) {
            this.initializationPromise = this.initializeOrganization();
        }
        await this.initializationPromise;
    }

    async getOrganization() {
        const organizationQueryData = {
            query: organizationQuery,
            operationName: "Organization",
            variables: {
                input: {
                    slug: this.tallyApi.organizationName.toLowerCase()
                }
            }
        }

        try {
            const organizationResponse = await this.tallyApi.makeRequest(organizationQueryData);

            if (!organizationResponse) {
                throw new Error("Empty organization response received");
            }

            if (!organizationResponse.organization) {
                throw new Error("Organization not found");
            }

            if (!organizationResponse.organization.governorIds?.length) {
                throw new Error("No governor IDs found for organization");
            }

            return organizationResponse.organization;
        } catch (error) {
            console.error("Error in getOrganization:", error);
            throw error;
        }
    }

    async getProposalCount() {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        return this.organization?.proposalsCount || 0;
    }

    async getAllProposals(parameters: getAllProposalsParameters) {
        await this.ensureInitialized();

        if (!this.organization) {
            console.error("Organization still not initialized after ensureInitialized");
            throw new Error("Organization not initialized");
        }

        console.log(`Fetching proposals for ${this.organization.governorIds.length} governor IDs`);
        console.log("Parameters:", JSON.stringify(parameters, null, 2));

        // Fetch proposals from all governor IDs, handling errors for each request
        const proposals = await Promise.all(
            this.organization.governorIds.map(async (governorId) => {
                console.log(`Fetching proposals for governor ID: ${governorId}`);
                try {
                    const response = await this.tallyApi.makeRequest({
                        query: proposalsQuery,
                        operationName: "Proposals",
                        variables: {
                            governorId,
                            sort: { sortBy: "id", isDescending: parameters.isDescending },
                            page: { limit: parameters.limit },
                            afterCursor: parameters.afterCursor,
                        }
                    });

                    if (!response?.proposals?.nodes) {
                        console.error(`Invalid response structure for governor ${governorId}:`, response);
                        return [];
                    }

                    console.log(`Successfully fetched ${response.proposals.nodes.length} proposals for governor ${governorId}`);
                    return response.proposals.nodes;
                } catch (error) {
                    console.error(`Failed to fetch proposals for governor ${governorId}:`, {
                        error: error instanceof Error ? {
                            message: error.message,
                            stack: error.stack
                        } : error,
                        governorId
                    });
                    return []; // Return empty array for failed requests
                }
            })
        );

        // Flatten and sort all proposals
        const allProposals = proposals.flat();
        console.log(`Total proposals fetched: ${allProposals.length}`);

        const sortedProposals = allProposals.sort((a, b) => {
            if (parameters.isDescending) {
                return b.id - a.id;
            }
            return a.id - b.id;
        });

        console.log(`Returning ${sortedProposals.length} sorted proposals`);
        return sortedProposals;
    }

    async getProposalById(parameters: getProposalByIdParameters) {
        if (!this.organization) {
            this.organization = await this.getOrganization();
        }
        const proposalQueryData = {
            query: proposalQuery,
            operationName: "Proposal",
            variables: {
                input: { id: parameters.id }
            }
        }
        const proposalResponse = await this.tallyApi.makeRequest(proposalQueryData);
        return proposalResponse || null;
    }

    async getProposalByName(parameters: getProposalByNameParameters) {
        return "You can only request Tally proposals by id. Try using the getProposalById method.";
    }
}